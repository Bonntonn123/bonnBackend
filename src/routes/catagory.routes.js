import { Router } from 'express'
import {
    addCatagory,
    deleteCatagory,
    getAllCatagory
} from '../controllers/catagory.controller.js'
import {upload} from "../middlewares/multer.middleware.js"

const router = new Router()

router.route('/add-catagory').post(upload.single('catagoryPic'), addCatagory)
router.route('/delete-catagory').delete(deleteCatagory)
router.route('/get-catagory').get(getAllCatagory)

export default router