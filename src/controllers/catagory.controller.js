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

const getCatagory = asyncHandler(async (req, res) => {

    const { catagoryId } = req.query

    const catagory = await Catagory.findById(new mongoose.Types.ObjectId(catagoryId))

    if(!catagory) {
        throw new ApiError(404, "Catagory Not Found")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(201, catagory, "Catagory Fetched Successfully")
    )
})

const editCatagory = asyncHandler(async (req, res) => {
    try {
      const { id } = req.query; // Category ID passed as a URL parameter
      const { catagory, catagoryDesc } = req.body; // Data to update
      let catagoryPic; // For the picture uploaded via multer
      console.log(id, catagory, catagoryDesc, req.file?.path);
  
      // Check if the category exists
      const existingCatagory = await Catagory.findById(id);
      if (!existingCatagory) {
        return res.status(404).json(new ApiResponse(404, false, "Catagory Not Found"));
      }
  
      // If a new picture is uploaded
      if (req?.file?.path) {
          // Upload the picture to Cloudinary
          const data = await uploadOnCloudinary(req?.file?.path);
          catagoryPic = data.url
          console.log(catagoryPic)
      } else {
        // If no new picture is uploaded, keep the old picture
        catagoryPic = existingCatagory.catagoryPic;
      }
  
      // Update the category fields
      existingCatagory.catagory = catagory || existingCatagory.catagory;
      existingCatagory.catagoryDesc = catagoryDesc || existingCatagory.catagoryDesc;
  
      // Update the picture only if a new one is provided
      existingCatagory.catagoryPic = catagoryPic;
  
      // Save the updated category
      await existingCatagory.save();
  
      res.status(200).json(new ApiResponse(200, existingCatagory, "Catagory Updated Successfully"));
    } catch (error) {
      res.status(500).json({ message: "Error updating category", error: error.message });
    }
  });
  
export {
    addCatagory,
    deleteCatagory,
    getAllCatagory,
    getCatagory,
    editCatagory
}