import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { Address } from "../models/address.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const createAddress = asyncHandler(async (req, res) => {

    const { houseName, houseNumber, streetName, city, landmark, phone, pincode } = req.body

    console.log(houseName, houseNumber, streetName, city, landmark, phone, pincode)

    const mobileNumberRegex = /^[6-9]\d{9}$/;
    if(!mobileNumberRegex.test(phone)) {
        throw new ApiError(400, "Invalid Mobile Number")
    }

    try {
        if (
            [houseName, houseNumber, streetName, city, landmark, phone, pincode].some((field) => field?.trim() === "")
        ) {
            throw new ApiError(400, "All fields are required")
        }
        
        const findIfAddressAlreadyExist = await Address.findOne({ phone })

        if(findIfAddressAlreadyExist) {
            throw new ApiError(409, "Address Already Exist")
        }

        const address = await Address.create({
            userId: req.user?._id,
            houseName, 
            houseNumber, 
            streetName, 
            city, 
            landmark, 
            phone, 
            pincode
        })

        return res
        .status(200)
        .json(
            new ApiResponse(200, address, "Address Added Successfully")
        )
        
    } catch (error) {
        throw new ApiError(500, error.message)
    } 

})

const deleteAddress = asyncHandler(async (req, res) => {

    const { addressId } = req.query

    try {
        const deletedAddress = await Address.findByIdAndDelete(new mongoose.Types.ObjectId(addressId))
    
        if(!deletedAddress) {
            throw new ApiError(409, "Address Dosent Exist")
        }
    
        return res
        .status(200)
        .json(
            new ApiResponse(200, true, "Address Deleted Successfully")
        )
    } catch (error) {
        throw new ApiError(500, error.message)
    }
})

const getAllUserAddress = asyncHandler(async (req, res) => {

    try {
        const userAddress = await Address.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(req.user?._id) 
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userInfo",
                    pipeline: [
                        {
                            $project: {
                                username: 1,
                                fullName: 1,
                                email: 1,
                            }
                        }
                    ]
                  }
              },
        ])

        
        return res
        .status(200)
        .json(
            new ApiResponse(200, userAddress, "User Address Fetched Successfully")
        )
    } catch (error) {
        throw new ApiError(500, error.message)
    }

})

const updateAddress = asyncHandler(async (req, res) => {

    const { addressId } = req.query
    const { houseName, houseNumber, streetName, city, landmark, pincode } = req.body

    const updatedAdress = await Address.findByIdAndUpdate(
        new mongoose.Types.ObjectId(addressId),
        {
            $set: {
                houseName, 
                houseNumber, 
                streetName, 
                city, 
                landmark, 
                pincode
            }
        },
        { new: true }
    )

    if(!updatedAdress) {
        throw new ApiError(500, "Failed To Update Address")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedAdress, "Address Updated Successfully")
    )
})

export {
    createAddress,
    deleteAddress,
    getAllUserAddress,
    updateAddress
}