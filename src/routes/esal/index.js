import { Router } from 'express'
import datosEstados from '../../controllers/esal/datos-estados.js'

const router = Router()

router.get('/datosEstados/:esalId', datosEstados)

export default router