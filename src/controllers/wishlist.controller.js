import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { Wishlist } from "../models/wishlist.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const addToWishlist = asyncHandler(async (req, res) => {

    const { productName, productPic, productPrice } = req.body

    try {

        const checkIfProductAlreadyAddedToWishlist = await Wishlist.findOne({
            $and: [{userId: new mongoose.Types.ObjectId(req.user?._id)}, {productName}]
        })
    
        if(checkIfProductAlreadyAddedToWishlist) {
            throw new ApiError(409, "Item Already Exist In Wishlist")
        }

        const wishlist = await Wishlist.create({
            userId: req.user?._id,
            productName, 
            productPic, 
            productPrice
        })
    
        if(!wishlist) {
            throw new ApiError(500, "Failed To Add Product To Wishlist")
        }
    
        return res
        .status(200)
        .json(
            new ApiResponse(200, wishlist, "Product Added To Wishlist Successfully")
        )
    } catch (error) {
        throw new ApiError(500, error.message)
    }
})

const deleteFromWishlist = asyncHandler(async (req, res) => {

    const { productId } = req.query

    try {
        const deletedFromWishlist = await Wishlist.findByIdAndDelete(
            new mongoose.Types.ObjectId(productId)
        )
    
        if(!deletedFromWishlist) {
            throw new ApiError(500, "Failed To Remove Product From Wishlist")
        }
    
        return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Product Removed From Wishlsit Successfully")
        )
    } catch (error) {
        throw new ApiError(500, error.message)
    }
})

const getUserWishlist = asyncHandler(async (req, res) => {

    try {
        const userWishlist = await Wishlist.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(req.user?._id)
                }
            }
        ])
    
        return res
        .status(200)
        .json(
            new ApiResponse(200, userWishlist, "User Wishlist fetched Successfully")
        )
    } catch (error) {
        throw new ApiError(500, error.message)
    }
})

export {
    addToWishlist,
    deleteFromWishlist,
    getUserWishlist
}