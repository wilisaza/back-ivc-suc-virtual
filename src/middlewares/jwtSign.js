import jwt from 'jsonwebtoken'
import logger from '../util/logger.js'

export const generateAppToken = (payload) => {
  logger.info(`[jwtSing] Generando appToken`)
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' })
}
