import {QueryTypes} from 'sequelize'
import { getOracleSequelizeConnection } from '../../sequelize/getOracleSequelizeConnection.js'
import {isEmpty, encrypt} from '../../util/index.js'
import { generateAppToken } from '../../middlewares/jwtSign.js'
import Logger from '../../util/logger.js'


export default async (req, res) => {
    const fName = '[login-pin]'
    const logger = Logger

    const {pin, clave} = req.body
    
    if (isEmpty(pin)) {
        logger.error(`[${fName}] No Pin provided`)
        return res.status(400).json({ error: 'No Pin provided' })
    }
    if (isEmpty(clave)) {
        logger.error(`[${fName}] No Clave provided`)
        return res.status(400).json({ error: 'No Clave provided' })
    }

    const resultOracleCredentials = await getOracleSequelizeConnection({ logger })
    if (!resultOracleCredentials?.success) {
        const error = `Error al obtener las credenciales de la base de datos`
        logger.error(`${fName} ${error}`)
        return res.status(500).json({ success: false, error })
    }

    const {config: sequelizeConfig} = resultOracleCredentials ?? {}

    console.log(encrypt('123'))

    let sqlString = `SELECT ESAL_ID, ESAL_RUT, ESAL_ACTIVA, NOMBRE_EN_CAMARA 
                    FROM T_ESAL 
                    WHERE PIN = '${pin} ' 
                    AND PIN_CLAVE = '${encrypt(clave)}'`
    
    logger.info(`${fName} Consultando PIN de usuario`)

    try {
        await sequelizeConfig.authenticate()
        let getUser = await sequelizeConfig.query(sqlString,{
            type: QueryTypes.SELECT
        })
        if (isEmpty(getUser)) {
            logger.error(`[${fName}] No User found`)
            return res.status(400).json({ error: 'No User found' })
        }
        
        if (getUser[0].ESAL_ACTIVA !== 'S') {
            logger.error(`[${fName}] User is not active`)
            return res.status(400).json({ error: 'User is not active' })
        }
        const appToken = generateAppToken({
            id: getUser[0].ESAL_ID,
            rut: getUser[0].ESAL_RUT,
            nombreEnCamara: getUser[0].NOMBRE_EN_CAMARA
        })
        return res.status(200).json({ success: true, data:appToken, nombre: getUser[0].NOMBRE_EN_CAMARA })
    } catch (err) {
        const error = `Error: ${err.message}`
        logger.error(`${fName} ${error}`)
        return res.status(500).json({ success: false, error: error })
    } finally {
        logger.info(`${fName} Cerrando conexión a la base de datos`)
        await sequelizeConfig.close()
    }

}