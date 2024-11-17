import { Router } from 'express'
import {
    addCatagory,
    deleteCatagory,
    getAllCatagory
} from '../controllers/catagory.controller.js'
import { testFunction } from '../middlewares/test.middleware.js'

const router = new Router()

router.route('/add-catagory').post(addCatagory)
router.route('/delete-catagory').delete(deleteCatagory)
router.route('/get-catagory').get(getAllCatagory)

export default router