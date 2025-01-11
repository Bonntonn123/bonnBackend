import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { Cart } from "../models/cart.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const addToCart = asyncHandler(async (req, res) => {

    const {variantId, productId, productPic, productName, productQuantity, productPrice, boxType} = req.body

    console.log(variantId, productId, productPic, productName, productQuantity, productPrice, boxType)

    const checkIfProductAlreadyAddedToCart = await Cart.findOne(
        {
            $and: [{userInfo: new mongoose.Types.ObjectId(req.user?._id)}, {productName}, {variantId}]
        }
    )

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
        variantId,
        productId,
        productPic, 
        productName,
        productQuantity,
        productPrice,
        boxType
    })

    if(!productAddedToCart) {
        throw new ApiError(500, "Failed To Add Product To Cart")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, productAddedToCart, `${productName} Added To Cart Successfully`))
})

const deleteFromCart = asyncHandler(async (req, res) => {

    const { cartId } = req.query
    console.log(cartId)
    const deletedProduct = await Cart.findByIdAndDelete(new mongoose.Types.ObjectId(cartId))

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

    const { cartId, productQuantity } = req.body

    console.log(cartId, productQuantity)
    const product = await Cart.findById(new mongoose.Types.ObjectId(cartId))

    if(!product) {
        throw new ApiError(404, "Product Not Found")
    }

    product.productQuantity = productQuantity
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
    // console.log("--Cart Products--", cartProducts)
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