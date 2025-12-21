import { getOracleSequelizeConnection } from '../../sequelize/getOracleSequelizeConnection.js'
import tDatosbasicosEstadosNiifService from '../../sequelize/services/tDatosbasicosEstadosNiif-service.js'
import {isEmpty} from '../../util/index.js'
import Logger from '../../util/logger.js'


export default async (req, res) => {
    const fName = '[datos-estados]'
    const logger = Logger

    const {esalId} = req.params
    
    if (isEmpty(esalId)) {
        logger.error(`[${fName}] No ESAL ID provided`)
        return res.status(400).json({ error: 'No ESAL ID provided' })
    }

    const resultOracleCredentials = await getOracleSequelizeConnection({ logger })
    if (!resultOracleCredentials?.success) {
        const error = `Error al obtener las credenciales de la base de datos`
        logger.error(`${fName} ${error}`)
        return res.status(500).json({ success: false, error })
    }
    
    try {
        const {config: sequelizeConfig} = resultOracleCredentials ?? {}

        // Obiene informacion de la base de datos
        const tDatosbasicosEstadosNiifServiceInstance = new tDatosbasicosEstadosNiifService(sequelizeConfig)
        const result = await tDatosbasicosEstadosNiifServiceInstance.findDatosBasicosEstadosNIIF({esalId})
        if (!result?.success) {
            const error = `Error al obtener los datos basicos de estados niif`
            logger.error(`${fName} ${error}`)
            return res.status(500).json({ success: false, error })
        }

        console.log(result)
        return res.status(200).json(result)
    } catch (err) {
        const error = `Error: ${err.message}`
        logger.error(`${fName} ${error}`)
        return res.status(500).json({ success: false, error: error })
    } 
}