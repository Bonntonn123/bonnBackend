import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { Code } from '../models/code.model.js'
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const codeIsAvailable = asyncHandler(async (req, res) => {

    const { code } = req.body

    const checkIfCodeExist = await Code.findOne({ name: code })
    console.log(checkIfCodeExist)
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
        new ApiResponse(200, true, "User Can Use Redeem Code")
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

export {
    codeIsAvailable,
    applyCode
}