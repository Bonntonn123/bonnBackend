import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { Code } from '../models/code.model.js'
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const createCode = asyncHandler(async (req, res) => {

    const { name, minOrderValue, expiryDate, discountPercentage } = req.query
    console.log(name, minOrderValue, expiryDate, discountPercentage)
    try {
        if(!name || !minOrderValue || !expiryDate || !discountPercentage) {
            throw new ApiError(400, "Enter all code details")
        }

        const checkIfCodeExist = await Code.findOne({ name })

        if(checkIfCodeExist) {
            return res.status(204).json(new ApiResponse(204, false, "Cupon Code Already Exist"))
        }

        const createdCode = await Code.create({
            name,
            minOrderValue,
            expiryDate,
            discountPercentage
        })

        if(!createdCode) {
            throw new ApiError(500, "Failed to create discount code")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200, createdCode, "Discount Code Created Successfully")
        )

    } catch (error) {
        throw new ApiError(500, error.message)
    }
})

const codeIsAvailable = asyncHandler(async (req, res) => {

    const { code } = req.query
    console.log(code)
    const checkIfCodeExist = await Code.findOne({ name: code })
    if(!checkIfCodeExist) {
        throw new ApiError(404, "Invalid Code")
    }

    const user = await User.findById(req.user?._id)

    const checkIfUserHasUsedTheCode = user.usedCodes.includes(checkIfCodeExist._id)
    
    if(checkIfUserHasUsedTheCode) {
        return res
        .status(200)
        .json(
            new ApiResponse(200, false, "User Has Already Used Reedem Code")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, {
            available: true,
            code: checkIfCodeExist
        }, "User Can Use Redeem Code")
    )
})

const applyCode = asyncHandler(async (req, res) => {

    const { code } = req.body

    const codeId = await Code.findOne({name: code})
    const user = await User.findById(req.user?._id)
    
    user.usedCodes.push(codeId._id)
    user.save({ validateBeforeSave: false})

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, 'Code Applied Successfully')
    )

})

const getAllCodes = asyncHandler(async (req, res) => {

    console.log("Inside Code")
    const getCodes = await Code.aggregate([
        {
            $match: {}
        }
    ])

    return res.status(201).json(new ApiResponse(201, getCodes, "All Codes Fetched"))
})

const deleteCode = asyncHandler(async (req, res) => {

    const { cuponId } = req.query

    const deletedCode = await Code.findByIdAndDelete(new mongoose.Types.ObjectId(cuponId))

    return res.status(201).json(new ApiResponse(201, deletedCode, "Cupon Code Deleted Successfully"))
})

const updateCupon = asyncHandler(async (req, res) => {

    const { cuponId } = req.query
    const { name, minOrderValue, expiryDate, discountPercentage } = req.body
    console.log(name, minOrderValue, expiryDate, discountPercentage)

    const currentCuponCode = await Code.findById(new mongoose.Types.ObjectId(cuponId))
    if(!currentCuponCode) {
        throw new ApiError(404, "Cupon Code Not Found")
    }

    currentCuponCode.name = name;
    currentCuponCode.minOrderValue = minOrderValue;
    currentCuponCode.expiryDate = expiryDate;
    currentCuponCode.discountPercentage = discountPercentage;
    await currentCuponCode.save({ validateBeforeSave: false })

    return res.status(201).json(new ApiResponse(201, true, "Code Updated Successfully"))
})

export {
    codeIsAvailable,
    applyCode,
    createCode,
    getAllCodes,
    deleteCode,
    updateCupon
}