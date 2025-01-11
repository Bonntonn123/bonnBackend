import mongoose, {Schema} from "mongoose";

const cartSchema = new Schema(
    {
        userInfo: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        variantId: {
            type: Schema.Types.ObjectId,
            ref: "Product"
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product"
        },
        productPic: {
            type: String,
            required: true,
        },
        productName: {
            type: String,
            required: true,
        },
        productQuantity: {
            type: Number,
            default: 1
        },
        productPrice: {
            type: String,
            default: 0
        },
        boxType: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true
    }
)

export const Cart = mongoose.model("Cart", cartSchema)