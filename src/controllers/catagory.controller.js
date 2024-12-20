import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { Catagory } from "../models/catagory.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addCatagory = asyncHandler(async (req, res) => {

    const { catagory } = req.query
    const { catagoryDesc } = req.body

    // console.log(catagory, catagoryDesc)
    try {
        const checkIfCatagoryExist = await Catagory.findOne({ catagory })
    
        if(checkIfCatagoryExist) {
            return res.status(204).json(new ApiResponse(204, false, "Catagory Already Exist"))
        }
        
        const catagoryPic_URL = await uploadOnCloudinary(req.file?.path);
        console.log(req.file?.path)
        // console.log(catagory, catagoryDesc, catagoryPic_URL?.url)
        const createdCatagory = await Catagory.create({
            catagory,
            catagoryPic: catagoryPic_URL?.url,
            catagoryDesc: catagoryDesc || "Description Unavailable"
        })

        if(!createdCatagory) {
            throw new ApiError(500, "Failed To Create Catagory")
        }

        return res
        .status(201)
        .json(
            new ApiResponse(200, createdCatagory, "Catagory Created Successfully")
        )

    } catch (error) {
        throw new ApiError(500, error)
    }
})

const deleteCatagory = asyncHandler(async (req, res) => {

    const { catagoryId } = req.query
    console.log(catagoryId)
    try {

        const checkIfCatagoryIsLinked = await Product.aggregate([
            {
                $match: {
                    catagory: new mongoose.Types.ObjectId(catagoryId)
                }
            }
        ])

        if(checkIfCatagoryIsLinked.length > 0) {
            console.log(checkIfCatagoryIsLinked)
            return res.status(204).json(new ApiResponse(204, false, "Remove Catagory From Linked Product"))
        }
        const deletedCatagory = await Catagory.findByIdAndDelete(new mongoose.Types.ObjectId(catagoryId))
    
        if(!deletedCatagory) {
            throw new ApiError(500, "Failed To Delete Catagory")
        }
    
        return res
        .status(201)
        .json(
            new ApiResponse(201, deletedCatagory, "Catagory Deleted Successfully")
        )
    } catch (error) {
        throw new ApiError(500, error)
    }
})

const getAllCatagory = asyncHandler(async (req, res) => {
    const allCatagory = await Catagory.aggregate([
        {
            $match: {}
        }
    ])

    if(!allCatagory) {
        throw new ApiError(500, "Failed To Get Catagory")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(201, allCatagory, "Catagory Fetched Successfully")
    )
})

export {
    addCatagory,
    deleteCatagory,
    getAllCatagory
}