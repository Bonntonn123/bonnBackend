import { Router } from 'express'
import {
    addProduct,
    deleteProduct,
    getProduct,
    getAllProducts
} from '../controllers/product.controller.js'
import {upload} from "../middlewares/multer.middleware.js"

const router = new Router()

router.route('/add-product').post( 
    upload.fields([
        {
            name: "variantPic_1",
            maxCount: 16
        }, 
        {
            name: "variantPic_2",
            maxCount: 16
        },
        {
            name: "variantPic_3",
            maxCount: 16
        },
        {
            name: "variantPic_4",
            maxCount: 16
        },
    ])
    , addProduct)

router.route('/delete-product/:productId').delete(deleteProduct)
router.route('/get-product').get(getProduct)
router.route('/all-products').get(getAllProducts)


export default router