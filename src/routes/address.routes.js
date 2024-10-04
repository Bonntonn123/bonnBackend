import { Router } from 'express'
import {
    createAddress,
    deleteAddress,
    getAllUserAddress,
    updateAddress
} from '../controllers/address.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router = new Router()

router.route('/add-address').post(verifyJWT, createAddress)
router.route('/delete-address').delete(verifyJWT, deleteAddress)
router.route('/get-address').get(verifyJWT, getAllUserAddress)
router.route('/update-address').patch(verifyJWT, updateAddress)

export default router