import { Router } from 'express'
import {
    codeIsAvailable,
    applyCode
} from '../controllers/code.controllers.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router = new Router()

router.route('/check-code').get(verifyJWT, codeIsAvailable)
router.route('/apply-code').post(verifyJWT, applyCode)

export default router