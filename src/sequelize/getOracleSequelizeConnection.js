import OracleDB from 'oracledb'
import { Sequelize } from 'sequelize'
import { isEmpty } from '../util/index.js'
import Logger from '../util/logger.js'

let clientOpts = {};

clientOpts = { libDir: `${process.env.PATH_ORACLE_INSTANT_CLIENT}` };

OracleDB.initOracleClient(clientOpts)

export const getOracleSequelizeConnection = async ({ logger = Logger } = {}) => {
  const fName = '[getOracleSequelizeConnection]'

  // Obtiene las credenciales de la base de datos desde las variables de entorno
  const username = process.env.ORACLE_USERNAME
  const password = process.env.ORACLE_PASSWORD
  const connectString = process.env.ORACLE_CONNECTION_STRING

  if (isEmpty(username) || isEmpty(password) || isEmpty(connectString)) {
    const error = 'No se posee credenciales de acceso a la base de datos'
    logger.error(`${fName} ${error}`)
    return { success: false, error }
  }

  const sequelize = new Sequelize({
    username,
    password,
    dialect: 'oracle',
    dialectOptions: {
      connectString: connectString,
      maxRows: 100000,
      fetchAsString: [OracleDB.NUMBER],
    },
    retry: {
      max: 5,
    },
    logging: false,
  })

  return { success: true, config: sequelize }
}
