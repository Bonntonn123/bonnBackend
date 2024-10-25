import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import crypto from 'crypto'

function generateUniqueId() {
  return crypto.randomBytes(16).toString('hex');
}

const addProduct = asyncHandler(async (req, res) => {

    const { catagory, varient, boxSize } = req.body;

    console.log(JSON.parse(boxSize))
    // console.log("Inside Controller", varient[1])
    try {
        if (!catagory || !varient || !boxSize) {
            throw new ApiError(400, 'All fields are required.');
          }

          const checkIfProductAlreadyExist = await Product.findOne({
            $and: [{varient}, {catagory}]
          })

          if(checkIfProductAlreadyExist) {
            throw new ApiError(409, "Product Already Exist")
          }
         
          // console.log(req.files)
      await Promise.all(varient.map(async (item, index) => {
        const pic1_url = await uploadOnCloudinary(req.files?.variantPic_1[index]?.path);
        const pic2_url = await uploadOnCloudinary(req.files?.variantPic_2[index]?.path);
        const pic3_url = await uploadOnCloudinary(req.files?.variantPic_3[index]?.path);
        const pic4_url = await uploadOnCloudinary(req.files?.variantPic_4[index]?.path);

        // console.log(pic1_url.url)
        // Assign the URLs to the variant's properties
        varient[index].variantPic_1 = pic1_url.url
        varient[index].variantPic_2 = pic2_url.url
        varient[index].variantPic_3 = pic3_url.url
        varient[index].variantPic_4 = pic4_url.url
    }));
        
          const product = await Product.create({
            // productName,
            // productDesc,
            catagory,
            varient,  // Directly use the varient array
            boxSize: JSON.parse(boxSize),  // Directly use the boxSize array
          });
    
          if(!product) {
            throw new ApiError(500, "Failed To Upload Product")
          }
        
        return  res.status(201).json(new ApiResponse(201, product,'Product created successfully'));
    } catch (error) {
        throw new ApiError(error.code, error.message)
    }
})

const deleteProduct = asyncHandler(async (req, res) => {

    const { productId } = req.query

    const deletedProduct = await Product.findByIdAndDelete({productId})

    if(!deletedProduct) {
        throw new ApiError(500, "Failed To Delete Product")
    }

    return res
    .status(200)
    .json(
        new ApiError(200, {}, "Product Deleted Successfully")
    )
})

const getProduct = asyncHandler(async (req, res) => {

  const { productName } = req.body
  const regex = new RegExp(productName, 'i');
  console.log(regex)
  const product = await Product.aggregate([

    {
      $match:{
        $or: [
            { productName: { $regex: regex } },
            { productDesc: { $regex: regex } },
            {
              varient: {
                  $elemMatch: {
                      $or: [
                          { variantName: { $regex: regex } },
                          { variantDesc: { $regex: regex } }
                      ]
                  }
              }
            }
        ]
      }
    }
  ])

  return res
  .status(200)
  .json(
    new ApiResponse(200, product, `${productName} Fetched Successfully`)
  )
})

const getAllProducts = asyncHandler(async (req, res) => {

  const allProducts = await Product.aggregate([
    {
      $match: {}
    }
  ])

  return res
  .status(200)
  .json(
    new ApiResponse(200, allProducts, 'All Products Fetched Successfully')
  )
})

const filterProduct = asyncHandler(async (req, res) => {
  const { category, priceRange, boxSize } = req.query;

  // Build the aggregation pipeline
  const pipeline = [];

  // 1. Filter by category if provided
  if (category) {
    pipeline.push({
      $match: { catagory: category }
    });
  }

  // 2. Filter by price range in variants if provided
  if (priceRange) {
    const [minPrice, maxPrice] = priceRange.split('-').map(Number);
    pipeline.push({
      $match: {
        'varient.variantPrice': { $gte: minPrice, $lte: maxPrice }
      }
    });
  }

  // 3. Filter by box size if provided
  if (boxSize) {
    pipeline.push({
      $match: { boxSize: boxSize }
    });
  }

  // Execute the aggregation pipeline
  const products = await Product.aggregate(pipeline);

  res.status(200).json(
    new ApiResponse(200, products, 'Products Fetched Successfully')
  );
});

export {
    addProduct,
    deleteProduct,
    getProduct,
    getAllProducts,
    filterProduct
}