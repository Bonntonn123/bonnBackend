import { Router } from 'express'
import {
    codeIsAvailable,
    applyCode,
    createCode,
    getAllCodes,
    deleteCode,
    updateCupon
} from '../controllers/code.controllers.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import {upload} from "../middlewares/multer.middleware.js"

const router = new Router()

router.route('/check-code').get(verifyJWT, codeIsAvailable)
router.route('/apply-code').post(verifyJWT, applyCode)
router.route('/create-code').post(createCode)
router.route('/get-code').get(getAllCodes)
router.route('/delete-code').delete(deleteCode)
router.route('/update-code').put(updateCupon)

export default router