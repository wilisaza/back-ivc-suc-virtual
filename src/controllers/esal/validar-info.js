import Logger from '../../util/logger.js'
import {isEmpty} from '../../util/index.js'
import { getOracleSequelizeConnection } from '../../sequelize/getOracleSequelizeConnection.js'
import tCuentasNiifService from '../../sequelize/services/tCuentasNiif-service.js'

export default async (req, res) => {
    const fName = '[validar-info]'
    const logger = Logger
    const {esalId, daenAno, data} = req.body

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
        // 1. Obtener conexión a BD
        const resultOracleCredentials = await getOracleSequelizeConnection({ logger })
        if (!resultOracleCredentials?.success) {
            throw new Error('Error al obtener conexión a base de datos')
        }
        const {config: sequelizeConfig} = resultOracleCredentials

        // 2. Instanciar el servicio de Cuentas NIIF
        const tCuentasNiifServiceInstance = new tCuentasNiifService(sequelizeConfig)
        
        // 3. Ejecutar la búsqueda de cuentas (Traigo todas las cuentas NIIF)
        const resultCuentas = await tCuentasNiifServiceInstance.findCuentasNiif({ where: {} })
        
        if (!resultCuentas.success) {
            throw new Error('Error buscando cuentas NIIF')
        }

        const cuentasNiif = resultCuentas.data // Array de instancia Sequelize

        const cuentasReferencia = cuentasNiif.map(c => ({
            cuenCodigo: c.cuenCodigo, 
            cuenNombre: c.cuenNombre,
            cuenId: Number(c.cuenId)
        }))

        logger.info(`${fName} Se obtuvieron ${cuentasReferencia.length} cuentas NIIF para validar`)

        // 1. Crear un Mapa de códigos válidos para búsqueda rápida y obtención de ID
        // Aseguramos que sean Strings para comparar correctamente
        const mapaCodigos = new Map()
        cuentasReferencia.forEach(c => {
            mapaCodigos.set(String(c.cuenCodigo), c.cuenId)
        })

        // 2. Validar cada registro de data y enriquecer con estado
        const dataValidada = data.map((item, index) => {
            const codigoEntrada = String(item.cuenCodigo)
            const cuenId = mapaCodigos.get(codigoEntrada)
            const existe = !!cuenId
            
            return {
                ...item,
                fila: index + 1,

                isValid: existe,
                cuenId: cuenId || null,
                validationMessage: existe ? 'OK' : 'Cuenta contable no encontrada en el maestro NIIF'
            }
        })

        // Verificamos si hubo algún error general (opcional, por si quieres un flag global)
        const hayErrores = dataValidada.some(item => !item.isValid)
        const totalErrores = dataValidada.filter(item => !item.isValid).length

        logger.info(`${fName} Validación completada. Registros totales: ${data.length}, Errores: ${totalErrores}`)

        return res.status(200).json({ 
            success: true, 
            message: 'Proceso de validación finalizado',
            isValidGlobal: !hayErrores, // Flag útil para saber si todo está perfecto de un vistazo
            resumen: {
                total: data.length,
                validos: data.length - totalErrores,
                invalidos: totalErrores
            },
            data: dataValidada // Array original enriquecido
        })

    } catch (error) {
        logger.error(`${fName} Error: ${error.message}`)
        return res.status(500).json({ success: false, error: error.message })
    }
}