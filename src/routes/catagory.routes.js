import { Router } from 'express'
import {
    addCatagory,
    deleteCatagory,
    getAllCatagory,
    getCatagory,
    editCatagory
} from '../controllers/catagory.controller.js'
import {upload} from "../middlewares/multer.middleware.js"

const router = new Router()

router.route('/add-catagory').post(upload.single('catagoryPic'), addCatagory)
router.route('/edit-catagory').put(upload.single('catagoryPic'), editCatagory)
router.route('/delete-catagory').delete(deleteCatagory)
router.route('/get-catagory').get(getAllCatagory)
router.route('/current-catagory').get(getCatagory)

export default router