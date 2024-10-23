import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { Review } from "../models/reviews.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import mongoose from "mongoose";

const addReview = asyncHandler(async (req, res) => {

    const { productId, stars, review} = req.body

    const checkIfReviewAlreadyExist = await Product.findOne({
        $and: [{productId: new mongoose.Types.ObjectId(productId)}, {userId: new mongoose.Types.ObjectId(req.user?._id)}]
    })

    if(!checkIfReviewAlreadyExist) {
        return res.status(200).json(new ApiResponse(200, false, "Customer Review Already Exist"))
    }

    const productReview = await Review.create({
        userId: req.user?._id,
        productId, 
        stars, 
        review
    })

    if(!productReview) {
        throw new ApiError(500, "Failed To Add Review")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, productReview, "Review Added Successfully")
    )
})

const deleteReview = asyncHandler(async (req, res) => {

    const { productId } = req.query

    const deletedReview = await Review.findByIdAndDelete(productId)

    if(!deletedReview) {
        throw new ApiError(500, "Failed To Delete Review")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, deletedReview, "Review Deleted Successfully"))
})

export {
    addReview,
    deleteReview
}