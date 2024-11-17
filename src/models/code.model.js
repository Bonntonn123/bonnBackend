import mongoose, {Schema} from "mongoose";

const codeSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Enter the discount code"]
        },
        minOrderValue: {
            type: Number,
        },
        discountPercentage: {
            type: Number,
        },
        expiryDate: {
            type: Date,
            required: [true, "Enter the expiry date"],
            expires: 0
        }
    },
    { timestamps: true }
)


export const Code = mongoose.model("Code", codeSchema)