import { Router } from 'express'
import loginPin from '../../controllers/login/login-pin.js'

const router = Router()

router.post('/pin', loginPin)

export default router