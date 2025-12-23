import gettCuentasNiif from '../models/tCuentasNiif.js'
import Logger from '../../util/logger.js'

export default class tCuentasNiifService {
    constructor(sequelizeConfig) {
        this.sequelizeConfig = sequelizeConfig
    }

    className = '[tCuentasNiifService]'

    /**
     * Busca cuentas NIIF basado en criterios
     */
    findCuentasNiif = async ({ where = {} } = {}, { logger = Logger } = {}) => {
        const fName = `${this.className} findCuentasNiif`
        
        try {
            logger.info(`[${fName}] Buscando cuentas con criterios: ${JSON.stringify(where)}`)
            await this.sequelizeConfig.authenticate()
            
            const tCuentasNiif = gettCuentasNiif(this.sequelizeConfig)
            const result = await tCuentasNiif.findAll({ where })
            
            return { success: true, data: result }
        } catch (err) {
            const error = `Error al buscar cuentas NIIF`
            logger.error(`[${fName}] ${error} ${err.message}`)
            throw err
        } finally {
            logger.info(`[${fName}] Cerrando conexión a la base de datos`)
            await this.sequelizeConfig.close()
        }
    }

    /**
     * Crea o inserta múltiples cuentas (útil para carga masiva)
     */
    bulkCreateCuentasNiif = async (data = [], { logger = Logger } = {}) => {
        const fName = `${this.className} bulkCreateCuentasNiif`

        if (!data || data.length === 0) {
            return { success: false, error: 'No data provided to save' }
        }

        try {
            logger.info(`[${fName}] Iniciando inserción masiva de ${data.length} registros`)
            await this.sequelizeConfig.authenticate()

            const tCuentasNiif = gettCuentasNiif(this.sequelizeConfig)
            
            // updateOnDuplicate: actualiza si ya existe la llave primaria (CUEN_ID)
            const result = await tCuentasNiif.bulkCreate(data, {
                updateOnDuplicate: ['CUEN_CODIGO', 'CUEN_NOMBRE', 'CUEN_IDPADRE', 'CUEN_TIPO', 'CUEN_NIVELNIIF'] 
            })

            logger.info(`[${fName}] Inserción exitosa`)
            return { success: true, data: result }
        } catch (err) {
            const error = `Error al insertar cuentas masivamente`
            logger.error(`[${fName}] ${error} ${err.message}`)
            throw err
        } finally {
            logger.info(`[${fName}] Cerrando conexión a la base de datos`)
            await this.sequelizeConfig.close()
        }
    }
}
