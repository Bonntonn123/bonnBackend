import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,  // Ensure product reference is always provided
      index: true      // Index for faster querying
    },
    stars: {
      type: Number,
      required: true,   // Ensure the star rating is always provided
      min: 1,           // Minimum rating is 1 star
      max: 5            // Maximum rating is 5 stars
    },
    review: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    }
  },
  { timestamps: true }
);

// Create an index to optimize search queries involving productId and stars
reviewSchema.index({ stars: -1 });

export const Review = mongoose.model("Review", reviewSchema);
