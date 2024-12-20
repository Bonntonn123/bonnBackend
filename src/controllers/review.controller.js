import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/reviews.model.js";
import mongoose from "mongoose";

const addReview = asyncHandler(async (req, res) => {
    const { productId, variantId } = req.query; // Add `variantId` to the query params
    const { stars, review } = req.body;
    const userId = req.user?._id;
  
    // Check if the product exists
    const product = await Product.findById(new mongoose.Types.ObjectId(productId));
    if (!product) {
      throw new ApiError(404, "Product Not Found");
    }
  
    // Check if the variant exists
    const variant = product.variant.find(v => v.id === variantId);
    if (!variant) {
      throw new ApiError(404, "Variant Not Found");
    }
  
    // Check if the user has already reviewed this variant
    const checkIfUserReviewAlreadyExist = await Review.findOne({
      $and: [{ productId }, { userId }, { variantId }]
    });
    if (checkIfUserReviewAlreadyExist) {
      return res.status(204).json(new ApiResponse(204, {}, "User Review Already Exists for this Variant"));
    }
  
    // Create a review
    const createReview = await Review.create({
      userId,
      productId,
      variantId, // Save the `variantId` with the review
      stars,
      review
    });
  
    if (!createReview) {
      throw new ApiError(500, "Failed To Add Review");
    }
  
    // Add the review ID to the variant's `reviews` array
    variant.reviews.push(createReview._id);
    await product.save();
  
    return res.status(200).json(new ApiResponse(200, createReview, "Review Added Successfully"));
  });

  
const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId, productId, variantId } = req.query; // Get reviewId, productId, and variantId from query params
    const userId = req.user?._id;
  
    // Validate product existence
    const product = await Product.findById(new mongoose.Types.ObjectId(productId));
    if (!product) {
      throw new ApiError(404, "Product Not Found");
    }
  
    // Validate variant existence
    const variant = product.variant.find(v => v.id === variantId);
    if (!variant) {
      throw new ApiError(404, "Variant Not Found");
    }
  
    // Validate review existence and ownership
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new ApiError(404, "Review Not Found");
    }
  
    if (review.userId.toString() !== userId.toString()) {
      throw new ApiError(403, "You can only delete your own reviews");
    }
  
    // Delete the review
    await review.remove();
  
    // Remove review ID from the variant's reviews array
    variant.reviews = variant.reviews.filter(rId => rId.toString() !== reviewId);
    await product.save();
  
    return res.status(200).json(new ApiResponse(200, {}, "Review Deleted Successfully"));
  });

const updateReview = asyncHandler(async (req, res) => {
    const { reviewId, productId, variantId } = req.query; // Get reviewId, productId, and variantId from query params
    const { stars, review } = req.body;
    const userId = req.user?._id;
  
    // Validate product existence
    const product = await Product.findById(new mongoose.Types.ObjectId(productId));
    if (!product) {
      throw new ApiError(404, "Product Not Found");
    }
  
    // Validate variant existence
    const variant = product.variant.find(v => v.id === variantId);
    if (!variant) {
      throw new ApiError(404, "Variant Not Found");
    }
  
    // Validate review existence and ownership
    const existingReview = await Review.findById(reviewId);
    if (!existingReview) {
      throw new ApiError(404, "Review Not Found");
    }
  
    if (existingReview.userId.toString() !== userId.toString()) {
      throw new ApiError(403, "You can only update your own reviews");
    }
  
    // Update the review
    existingReview.stars = stars ?? existingReview.stars;
    existingReview.review = review ?? existingReview.review;
    const updatedReview = await existingReview.save();
  
    return res.status(200).json(new ApiResponse(200, updatedReview, "Review Updated Successfully"));
  });

const getMostReviewedVariant = asyncHandler(async (req, res) => {
    const { productId } = req.query;
  
    // Validate product existence
    const product = await Product.findById(new mongoose.Types.ObjectId(productId));
    if (!product) {
      throw new ApiError(404, "Product Not Found");
    }
  
    // Find the variant with the most reviews
    const mostReviewedVariant = product.variant.reduce((max, current) => {
      return current.reviews.length > max.reviews.length ? current : max;
    }, product.variant[0]);
  
    if (!mostReviewedVariant || mostReviewedVariant.reviews.length === 0) {
      return res.status(404).json(new ApiResponse(404, {}, "No Reviews Found for Any Variant"));
    }
  
    return res.status(200).json(new ApiResponse(200, mostReviewedVariant, "Most Reviewed Variant Retrieved Successfully"));
  });
  
const getAllReviewsOfVariant = asyncHandler(async (req, res) => {
    const { productId, variantId } = req.query;
  
    // Validate product existence
    const product = await Product.findById(new mongoose.Types.ObjectId(productId)).populate({
      path: "variant.reviews",
      populate: {
        path: "userId",
        select: "username", // Customize to fetch user details if needed
      },
    });
  
    if (!product) {
      throw new ApiError(404, "Product Not Found");
    }
  
    // Find the variant
    const variant = product.variant.find(v => v.id === variantId);
    if (!variant) {
      throw new ApiError(404, "Variant Not Found");
    }
  
    // Populate reviews
    const reviews = await Review.find({ _id: { $in: variant.reviews } }).populate("userId", "username");
  
    return res.status(200).json(new ApiResponse(200, reviews, "Reviews Retrieved Successfully"));
  });
   
export {
    addReview,
    deleteReview,
    updateReview,
    getMostReviewedVariant,
    getAllReviewsOfVariant
}