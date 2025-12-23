import xlsx from 'xlsx'
import Logger from '../../util/logger.js'
import {isEmpty} from '../../util/index.js'
import config from '../../config/index.js'

const { uploadEstadosNiif } = config

export default async (req, res) => {
    const fName = '[upload-estados-niif]'
    const logger = Logger
    
    const {esalId, daenAno} = req.body
    const file = req.file

    if (isEmpty(esalId)) {
        logger.error(`${fName} No ESAL_ID provided`)
        return res.status(400).json({ success: false, error: 'No ESAL_ID provided' })
    }
    if (isEmpty(daenAno)) {
        logger.error(`${fName} No DAEN_ANO provided`)
        return res.status(400).json({ success: false, error: 'No DAEN_ANO provided' })
    }
    if (!file) {
        logger.error(`${fName} No file provided`)
        return res.status(400).json({ success: false, error: 'No file provided' })
    }

    // 1. Validar tipo de archivo (Excel)
    const allowedMimes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel' // .xls
    ]

    if (!allowedMimes.includes(file.mimetype)) {
        logger.error(`${fName} Formato de archivo inválido: ${file.mimetype}`)
        return res.status(400).json({ 
            success: false, 
            error: 'Formato inválido. Solo se permiten archivos Excel (.xlsx, .xls)' 
        })
    }

    try {
        // 2. Leer el archivo desde memoria
        const workbook = xlsx.read(file.buffer, { type: 'buffer' })
        
        // 3. Obtener la primera hoja
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        
        //Validar que la hoja tenga datos y su contenido sea el del formato esperado
        if (!sheet) {
            logger.error(`${fName} Hoja no encontrada en el archivo Excel`)
            return res.status(400).json({ success: false, error: 'Hoja no encontrada en el archivo Excel' })
        }

        // Obtener la hoja como un array de arrays para poder ver los encabezados (fila 0)
        const sheetData = xlsx.utils.sheet_to_json(sheet, { header: 1 })
        
        if (!sheetData || sheetData.length === 0) {
            logger.error(`${fName} La hoja está vacía`)
            return res.status(400).json({ success: false, error: 'El archivo Excel está vacío' })
        }

        const headerRow = sheetData[0]
        const expectedHeaders = uploadEstadosNiif.map(item => item.field)
        
        // Validar que existan encabezados
        if (!headerRow || headerRow.length === 0) {
             logger.error(`${fName} No se encontraron encabezados en el archivo Excel`)
             return res.status(400).json({ success: false, error: 'El archivo no tiene encabezados válidos' })
        }

        // Validar que las columnas esperadas existan en el archivo (sin importar el orden o si hay extras)
        const missingColumns = expectedHeaders.filter(col => !headerRow.includes(col))

        if (missingColumns.length > 0) {
            const errorMsg = `Faltan las siguientes columnas obligatorias: ${missingColumns.join(', ')}`
            logger.error(`${fName} ${errorMsg}`)
            return res.status(400).json({ success: false, error: errorMsg })
        }

        // 4. Convertir a JSON
        const data = xlsx.utils.sheet_to_json(sheet)
        
        if (!data || data.length === 0) {
            return res.status(400).json({ success: false, error: 'El archivo Excel está vacío o no se pudo leer' })
        }

        logger.info(`${fName} Archivo procesado exitosamente. Filas leídas: ${data.length}`)
        
        // Retornamos los datos para visualizarlos por ahora
        return res.status(200).json({ 
            success: true, 
            message: 'Archivo leído exitosamente',
            totalRows: data.length,
            //preview: data.slice(0, 5) // Mostramos las primeras 5 filas como ejemplo
            data
        })

    } catch (err) {
        logger.error(`${fName} Error procesando archivo Excel: ${err.message}`)
        return res.status(500).json({ success: false, error: 'Error interno procesando el archivo Excel' })
    }
}