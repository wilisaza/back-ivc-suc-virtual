import logger from '../util/logger.js'

/*
 * Middleware para obtener crear una instancia de logger para cada peticion.
 */
const reqLoggerIdentMiddleware = async (req, res, next) => {
  // Busca el id de la peticion en las cabeceras, si no existe genera uno nuevo con la fecha actual en base 36
  const requestId = req.headers['x-request-id'] || new Date().getTime().toString(36)

  // Crea una instancia de logger para cada peticion
  req.logger = logger.child({
    // Genera el ID como la fecha en base 36 para evitar colisiones
    requestId,
    timestamp: new Date().toISOString(),
  })

  // Asigna el id a las cabezeras de la peticion y respuesta
  res.setHeader('x-request-id', requestId)

  next()
}

export default reqLoggerIdentMiddleware
