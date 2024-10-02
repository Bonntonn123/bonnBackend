import mongoose, { Schema } from "mongoose"

const orderSchema = new Schema({

    orderPrice: {
        type: Number,
        required: true
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    orderItems: [
        {
            type: Schema.Types.ObjectId,
            ref: "OrderItem"
        }
    ],
    address: {
        type: Schema.Types.ObjectId,
        ref: "Address"
    },
    status: {
        type: String,
        enum: ["PENDING", "CANCELLED", "DELIVERED"],
        default: "PENDING",
    }

}, {timestamps: true})

export const Order = mongoose.model("Order", orderSchema)