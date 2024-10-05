import { Router } from 'express'
import {
    addToWishlist,
    deleteFromWishlist,
    getUserWishlist
} from '../controllers/wishlist.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'


const router = new Router()

router.route('/add-to-wishlist').post(verifyJWT, addToWishlist)
router.route('/delete-to-wishlist').delete(verifyJWT, deleteFromWishlist)
router.route('/get-wishlist').get(verifyJWT, getUserWishlist)

export default router