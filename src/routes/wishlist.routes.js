import { Router } from 'express'
import {
    addToWishlist,
    deleteFromWishlist,
    getUserWishlist,
    checkIfProductInWishlist
} from '../controllers/wishlist.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'


const router = new Router()

router.route('/add-to-wishlist').post(verifyJWT, addToWishlist)
router.route('/delete-from-wishlist').delete(verifyJWT, deleteFromWishlist)
router.route('/get-wishlist').get(verifyJWT, getUserWishlist)
router.route('/check-product-in-wishlist').get(verifyJWT, checkIfProductInWishlist)

export default router