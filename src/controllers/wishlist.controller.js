import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { Wishlist } from "../models/wishlist.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const addToWishlist = asyncHandler(async (req, res) => {

    const { productId } = req.query

    console.log("--PRODUCTID--", productId)
    try {

        const checkIfProductAlreadyAddedToWishlist = await Wishlist.findOne({
            $and: [{userId: new mongoose.Types.ObjectId(req.user?._id)}, {productId}]
        })
    
        if(checkIfProductAlreadyAddedToWishlist) {
            throw new ApiError(409, "Item Already Exist In Wishlist")
        }

        const wishlist = await Wishlist.create({
            userId: req.user?._id,
            productId
            // productName, 
            // productPic, 
            // productPrice
        })
    
        if(!wishlist) {
            throw new ApiError(500, "Failed To Add Product To Wishlist")
        }
    
        return res
        .status(201)
        .json(
            new ApiResponse(201, wishlist, "Product Added To Wishlist Successfully")
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

// const getUserWishlist = asyncHandler(async (req, res) => {

//     try {
//         const userWishlist = await Wishlist.aggregate([
//             {
//                 $match: {
//                     userId: new mongoose.Types.ObjectId(req.user?._id)
//                 }
//             }
//         ])
    
//         return res
//         .status(200)
//         .json(
//             new ApiResponse(200, userWishlist, "User Wishlist fetched Successfully")
//         )
//     } catch (error) {
//         throw new ApiError(500, error.message)
//     }
// })

const getUserWishlist = asyncHandler(async (req, res) => {
    try {
      const userWishlist = await Wishlist.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(req.user?._id),
          },
        },
        {
          $lookup: {
            from: "products", // The name of the Product collection in MongoDB
            localField: "productId",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $unwind: "$productDetails", // Optional: Use this if you want to flatten the `productDetails` array
        },
      ]);
      
      console.log(userWishlist)
      return res
        .status(200)
        .json(
          new ApiResponse(200, userWishlist, "User Wishlist fetched Successfully")
        );
    } catch (error) {
      throw new ApiError(500, error.message);
    }
  });

  
const checkIfProductInWishlist = asyncHandler(async (req, res) => {

    const { productId } = req.query

    try {
        const checkIfProductAlreadyAddedToWishlist = await Wishlist.findOne({
            $and: [{userId: new mongoose.Types.ObjectId(req.user?._id)}, {productId}]
        })
    
        if(!checkIfProductAlreadyAddedToWishlist) {
            return res
            .status(404)
            .json(
             new ApiResponse(404, false, "Product Doesn't Exist In Wishlist")
            )
        }

        return res
            .status(200)
            .json(
             new ApiResponse(200, checkIfProductAlreadyAddedToWishlist, "Product Exist In Wishlist")
            )
    } catch (error) {
        throw new ApiError(500, error)
    }

})

export {
    addToWishlist,
    deleteFromWishlist,
    getUserWishlist,
    checkIfProductInWishlist
}