import mongoose, {Schema} from "mongoose";

const cartSchema = new Schema(
    {
        userInfo: {
            type: Schema.Types.ObjectId,
            ref: "User"
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
        }
    },
    {
        timestamps: true
    }
)

export const Cart = mongoose.model("Cart", cartSchema)