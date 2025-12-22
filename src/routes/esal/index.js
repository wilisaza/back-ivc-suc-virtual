import { Router } from 'express'
import multer from 'multer'
import { validateTokenSingle } from '../../middlewares/jwtValidate.js'
import datosEstados from '../../controllers/esal/datos-estados.js'
import uploadEstadosNiif from '../../controllers/esal/upload-estados-niif.js'
import validarInfo from '../../controllers/esal/validar-info.js'
import guardarInfo from '../../controllers/esal/guardar-info.js'

const router = Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.get('/datosEstados/:esalId', validateTokenSingle, datosEstados)
router.post('/datosEstados/guardarInfo', validateTokenSingle, guardarInfo)
router.post('/datosEstados/uploadEstadosNiif', validateTokenSingle, upload.single('file'), uploadEstadosNiif)
router.post('/datosEstados/validarInfo', validateTokenSingle, validarInfo)

export default router