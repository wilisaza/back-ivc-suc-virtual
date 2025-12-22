import gettEstadosFinancierosNiif from '../models/tEstadosFinancierosNiif.js'
import Logger from '../../util/logger.js'

export default class tEstadosFinancierosNiifService {
    constructor(sequelizeConfig) {
        this.sequelizeConfig = sequelizeConfig
    }

    className = '[tEstadosFinancierosNiifService]'

    bulkCreateEstadosFinancieros = async (data = [], { logger = Logger } = {}) => {
        const fName = `${this.className} bulkCreateEstadosFinancieros`

        if (!data || data.length === 0) {
            return { success: false, error: 'No data provided to save' }
        }

        try {
            logger.info(`[${fName}] Iniciando inserción masiva de ${data.length} registros`)
            await this.sequelizeConfig.authenticate()

            const tEstadosFinancierosNiif = gettEstadosFinancierosNiif(this.sequelizeConfig)
            
            // se suprime bulkCreate
            const result = await Promise.all(
                data.map(item => tEstadosFinancierosNiif.create(item))
            )

            logger.info(`[${fName}] Inserción exitosa`)
            return { success: true, data: result }
        } catch (err) {
            const error = `Error al insertar estados financieros masivamente`
            logger.error(`[${fName}] ${error} ${err.message}`)
            throw err
        } finally {
            logger.info(`[${fName}] Cerrando conexión a la base de datos`)
            await this.sequelizeConfig.close()
        }
    }
}
