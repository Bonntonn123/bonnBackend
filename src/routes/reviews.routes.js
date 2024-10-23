import { Router } from "express"
import {
    addReview
} from '../controllers/reviews.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router = new Router()

router.route('/add-review').post(verifyJWT, addReview)

export default router