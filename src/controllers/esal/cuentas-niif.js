import { getOracleSequelizeConnection } from '../../sequelize/getOracleSequelizeConnection.js'
import tCuentasNiifService from '../../sequelize/services/tCuentasNiif-service.js'
import Logger from '../../util/logger.js'

export default async (req, res) => {
    const fName = '[cuentas-niif]'
    const logger = Logger

    const resultOracleCredentials = await getOracleSequelizeConnection({ logger })
    if (!resultOracleCredentials?.success) {
        const error = `Error al obtener las credenciales de la base de datos`
        logger.error(`${fName} ${error}`)
        return res.status(500).json({ success: false, error })
    }
    
    try {
        const {config: sequelizeConfig} = resultOracleCredentials ?? {}

        // Obiene informacion de la base de datos
        const tCuentasNiifServiceInstance = new tCuentasNiifService(sequelizeConfig)
        const result = await tCuentasNiifServiceInstance.findCuentasNiif({where: {}})
        if (!result?.success) {
            const error = `Error al obtener los datos basicos de estados niif`
            logger.error(`${fName} ${error}`)
            return res.status(500).json({ success: false, error })
        }

        return res.status(200).json(result)
    } catch (err) {
        const error = `Error: ${err.message}`
        logger.error(`${fName} ${error}`)
        return res.status(500).json({ success: false, error: error })
    } 
}