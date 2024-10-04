import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { Cart } from "../models/cart.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import { response } from "express";

const addToCart = asyncHandler(async (req, res) => {

    const {productPic, productName, productQuantity, productPrice} = req.body

    console.log(productPic, productName, productQuantity, productPrice)

    const checkIfProductAlreadyAddedToCart = await Cart.findOne({productName})

    if(checkIfProductAlreadyAddedToCart) {

        checkIfProductAlreadyAddedToCart.productQuantity += productQuantity
        await checkIfProductAlreadyAddedToCart.save({ validateBeforeSave: false })

        return res
        .status(200)
        .json(
            new ApiResponse(200, checkIfProductAlreadyAddedToCart, "Product Quantity Updated")
        )
    }


    const productAddedToCart = await Cart.create({
        userInfo: req.user?._id,
        productPic, 
        productName,
        productQuantity,
        productPrice
    })

    if(!productAddedToCart) {
        throw new ApiError(500, "Failed To Add Product To Cart")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, productAddedToCart, "Product Added To Cart Successfully"))
})

const deleteFromCart = asyncHandler(async (req, res) => {

    const { productId } = req.query
    console.log(productId)
    const deletedProduct = await Cart.findByIdAndDelete(new mongoose.Types.ObjectId(productId))

    if(!deletedProduct) {
        throw new ApiError(500, "Failed To Delete Product")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, deletedProduct, "Product Removed From Cart")
    )

})

const increaseProductAmount = asyncHandler(async (req, res) => {

    const { productId, productQuantity } = req.body

    const product = await Cart.findById(new mongoose.Types.ObjectId(productId))

    if(!product) {
        throw new ApiError(404, "Product Not Found")
    }

    product.productQuantity = String(Number(product.productQuantity) + Number(productQuantity))
    await product.save({ validateBeforeSave: false })

    return res
    .status(200)
    .json(
        new ApiResponse(200, product, "Product Updated Successfully")
    )
})

const getAllCartProducts = asyncHandler(async (req, res) => {

    const cartProducts = await Cart.aggregate([
        {
            $match: {
                userInfo: new mongoose.Types.ObjectId(req.user?._id),
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(200, cartProducts, "Cart Products Fetched Successfully")
    )
})

export {
    addToCart,
    deleteFromCart,
    increaseProductAmount,
    getAllCartProducts
}