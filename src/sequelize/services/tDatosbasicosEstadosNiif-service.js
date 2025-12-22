import gettDatosbasicosEstadosNiif from '../models/tDatosbasicosEstadosNiif.js'
import Logger from '../../util/logger.js'
import {isEmpty} from '../../util/index.js'

export default class tDatosbasicosEstadosNiifService {
    constructor(sequelizeConfig) {
        this.sequelizeConfig = sequelizeConfig
    }

    className = '[tDatosbasicosEstadosNiifService]'
    findDatosBasicosEstadosNIIF = async ({esalId, attributes} = {}, {logger = Logger} = {}) => {
        const fName = `${this.className} findDatosBasicosEstadosNIIF`
        
        if (isEmpty(esalId)) {
            const error = 'No ESAL ID provided'
            logger.error(`[${fName}] ${error}`)
            return {success: false, error}
        }
        let where = {}
        try {
            logger.info(`[${fName}] Buscando datos basicos de estados niif para ESAL ID: ${esalId}`)
            await this.sequelizeConfig.authenticate()
            where.esalId = esalId
            const tDatosbasicosEstadosNiif = gettDatosbasicosEstadosNiif(this.sequelizeConfig)
            
            // Construimos las opciones de consulta
            const queryOptions = { where }
            if (attributes && attributes.length > 0) {
                queryOptions.attributes = attributes
            }

            const result = await tDatosbasicosEstadosNiif.findAll(queryOptions)
            return {success: true, data: result}
        } catch (err) {
            const error = `Error al buscar datos basicos de estados niif para ESAL ID: ${esalId}`
            logger.error(`[${fName}] ${error} ${err.message}`)
            throw error
        }finally {
            logger.info(`[${fName}] Cerrando conexión a la base de datos`)
            await this.sequelizeConfig.close()
        }
    }

    createDatosBasicosEstadosNIIF = async (data = {}, {logger = Logger} = {}) => {
        const fName = `${this.className} createDatosBasicosEstadosNIIF`
        
        if (isEmpty(data)) {
            const error = 'No data provided to create'
            logger.error(`[${fName}] ${error}`)
            return {success: false, error}
        }

        try {
            logger.info(`[${fName}] Creando registro de datos basicos estados NIIF`)
            await this.sequelizeConfig.authenticate()
            
            const tDatosbasicosEstadosNiif = gettDatosbasicosEstadosNiif(this.sequelizeConfig)
            const result = await tDatosbasicosEstadosNiif.create(data)
            
            return {success: true, data: result}
        } catch (err) {
            const error = `Error al crear registro de datos basicos estados niif`
            logger.error(`[${fName}] ${error} ${err.message}`)
            throw err
        } finally {
            logger.info(`[${fName}] Cerrando conexión a la base de datos`)
            await this.sequelizeConfig.close()
        }
    }
}