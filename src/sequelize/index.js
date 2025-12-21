import OracleDB from 'oracledb'
import Sequelize from 'sequelize'
import logger from '../util/logger.js'
/**
 * export for configure Sequelize object connection
 */

logger.info('Inicializando el cliente de OracleDB')
OracleDB.initOracleClient()

const sequelizeOracle = new Sequelize({
  username: process.env.ORACLE_USERNAME,
  password: process.env.ORACLE_PASSWORD,
  dialect: 'oracle',
  dialectOptions: {
    connectString: process.env.ORACLE_CONNECTION_STRING,
    maxRows: 100,
    fetchAsString: [OracleDB.NUMBER],
  },
  pool: {
    max: 50,
    min: 10,
    acquire: 30000,
    idle: 10000,
    evict: 1000,
  },
  retry: {
    max: 5, // Retry failed queries up to 5 times
  },
  logging: true,
})

export default sequelizeOracle
