import logger from '../util/logger.js'

const libName = '[jwtValidate]'

import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        logger.info(`${libName} Procesando payload del token`)
        
        // Validación 1: Verificar que el token contenga los datos requeridos
        const { id, rut, nombreEnCamara } = payload;
        
        if (!id || !rut || !nombreEnCamara) {
          logger.error(`${libName} Token rechazado: Faltan datos obligatorios`)
          return done(null, false, { message: 'Token incompleto: Faltan datos obligatorios' });
        }

        // Validación 2: La expiración ('exp') la valida passport-jwt automáticamente antes de llegar aquí.
        return done(null, { id, rut, nombreEnCamara });
      } catch (err) {
        logger.error(`${libName} ${ err}`)
        return done(err, false);
      }
    }
  )
);

export const validateTokenSingle = (req, res, next) => {
  if (!req.headers.authorization) {
    logger.error(`${libName} No se proporcionó el token de autorización`)
    return res.status(401).json({ success: false, error: 'Token de autorización no proporcionado' })
  }
  passport.authenticate("jwt", { session: false }, (err, tokenData, info) => {
    // 1. Error interno de la estrategia o servidor
    if (err) {
      logger.error(`${libName} Error interno validando token: ${err}`)
      return res.status(500).json({ success: false, error: 'Error interno en la validación del token' })
    }

    // 2. Autenticación fallida (tokenData es false)
    // Esto ocurre si el token expiró, firma inválida, o si devolvimos done(null, false) manualmente.
    if (!tokenData) {
      // 'info' trae el mensaje que pasamos en el done(null, false, { message: ... })
      // o los mensajes nativos de la librería (ej: "jwt expired")
      const errorMessage = info ? info.message : 'Token inválido'
      
      logger.error(`${libName} Fallo de autenticación: ${errorMessage}`)
      return res.status(401).json({ 
        success: false, 
        error: 'No autorizado',
        details: errorMessage 
      })
    }

    // 3. Éxito: inyectamos los datos en la request y continuamos
    req.user = tokenData
    return next()
  })(req, res, next);
}
