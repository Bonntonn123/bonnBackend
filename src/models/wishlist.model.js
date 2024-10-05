import mongoose, {Schema} from "mongoose";

const wishlistSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            index: true
        },
        productName: {
            type: String,
            required: [true, "Product Name Is Required"]
        },
        productPic: {
            type: String,
            required: [true, "Product Pic Is Required"]
        },
        productPrice: {
            type: Number,
            required: [true, "Product Price Is Required"]
        },
    },
    { timestamps: true }
)


export const Wishlist = mongoose.model("Wishlist", wishlistSchema)