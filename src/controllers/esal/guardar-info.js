import Logger from '../../util/logger.js'
import {isEmpty} from '../../util/index.js'
import { getOracleSequelizeConnection } from '../../sequelize/getOracleSequelizeConnection.js'
import tDatosbasicosEstadosNiifService from '../../sequelize/services/tDatosbasicosEstadosNiif-service.js'
import tEstadosFinancierosNiifService from '../../sequelize/services/tEstadosFinancierosNiif-service.js'

export default async (req, res) => {
    const fName = '[guardar-info]'
    const logger = Logger
    const {esalId: esalIdRaw, daenAno: daenAnoRaw, data} = req.body
    
    // Parseamos a Int para evitar NJS-011 (type mismatch)
    const esalId = parseInt(esalIdRaw)
    const daenAno = parseInt(daenAnoRaw)

    if (isEmpty(esalId)) {
        logger.error(`${fName} No ESAL_ID provided`)
        return res.status(400).json({ success: false, error: 'No ESAL_ID provided' })
    }
    if (isEmpty(daenAno)) {
        logger.error(`${fName} No DAEN_ANO provided`)
        return res.status(400).json({ success: false, error: 'No DAEN_ANO provided' })
    }
    
    if (isEmpty(data)) {
        logger.error(`${fName} No data provided`)
        return res.status(400).json({ success: false, error: 'No data provided' })
    }
    

    try {
        
        const dataValidada = data

        const totalErrores = data.filter(item => !item.isValid).length
        logger.info(`${fName} Registros totales: ${data.length}, Errores: ${totalErrores}`)

        const datosParaInsertar = data.filter(item => item.isValid)

        if (datosParaInsertar.length === 0) {
            logger.warn(`${fName} No hay registros válidos para insertar.`)
            // Retorna success pero indicando que no se insertó nada
             return res.status(200).json({ 
                success: true, 
                message: 'No existen registros válidos para insertar',
                inserted: 0,
                data: dataValidada
            })
        }

        //Crear el maestro (tDatosbasicosEstadosNiif)
        const connHeader = await getOracleSequelizeConnection({ logger })
        if (!connHeader?.success) throw new Error('Error al obtener conexión para cabecera')
        
        const tDatosbasicosService = new tDatosbasicosEstadosNiifService(connHeader.config)
        const headerData = {
            esalId: esalId,
            daenAno: daenAno,
            daenFechareg: new Date(),
            daenEstado: 'A', // Asumido Activo/Cargado
            daenPrincipal: 'S', // Asumido Principal
        }

        const resultHeader = await tDatosbasicosService.createDatosBasicosEstadosNIIF(headerData, { logger })
        
        if (!resultHeader.success) {
             throw new Error('Error creando la cabecera de datos básicos')
        }

        const daenId = resultHeader.data.daenId
        logger.info(`${fName} Cabecera creada con DAEN_ID: ${daenId}`)

        // 2. Insertar los Detalle (tEstadosFinancierosNiif)
        // Obtenemos nueva conexión
        const connDetails = await getOracleSequelizeConnection({ logger })
        if (!connDetails?.success) throw new Error('Error al obtener conexión para detalles')

        const tEstadosFinancierosService = new tEstadosFinancierosNiifService(connDetails.config)
        
        // Preparamos los objetos para bulkCreate o inserción individual
        const registrosDetalle = datosParaInsertar.map(item => ({
            daenId: Number(daenId),
            cuenId: Number(item.cuenId),
            esfnValor: parseFloat(item.cuenValor),
        }))
//console.log('registrosDetalle', registrosDetalle)
        // Usamos el servicio para insertar
        const resultDetalles = await tEstadosFinancierosService.bulkCreateEstadosFinancieros(registrosDetalle, { logger })

        if (!resultDetalles.success) {
             throw new Error('Error insertando detalle de estados financieros')
        }
        
        const totalInsertados = resultDetalles.data.length

        logger.info(`${fName} Se insertaron ${totalInsertados} registros en Estados Financieros`)

        return res.status(200).json({ 
            success: true, 
            message: 'Información guardada exitosamente',
            daenId: daenId,
            totalInsertados: totalInsertados,
            resumen: {
                total: data.length,
                validos: datosParaInsertar.length,
                invalidos: totalErrores
            },
            data: dataValidada // Devolvemos el estado de validación original
        })

    } catch (error) {
        logger.error(`${fName} Error: ${error.message}`)
        return res.status(500).json({ success: false, error: error.message })
    }
}