import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    addToCart,
    deleteFromCart,
    increaseProductAmount,
    getAllCartProducts
 } from "../controllers/cart.controller.js";


const router = Router()

router.route('/add-to-cart').post(verifyJWT, addToCart)
router.route('/remove-from-cart').delete(verifyJWT, deleteFromCart)
router.route('/update-cart').patch(verifyJWT, increaseProductAmount)
router.route('/get-user-cart').get(verifyJWT, getAllCartProducts)

export default router