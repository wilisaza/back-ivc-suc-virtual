import { Router } from 'express'
import multer from 'multer'
import { validateTokenSingle } from '../../middlewares/jwtValidate.js'
import datosEstados from '../../controllers/esal/datos-estados.js'

const router = Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.use(upload.single('file'))

router.get('/datosEstados/:esalId', validateTokenSingle, datosEstados)

router.post('/datosEstados/uploadEstadosNiif', validateTokenSingle, upload.single('file'), (req, res) => {
    res.status(200).json({ message: 'File uploaded successfully' })
})

export default router