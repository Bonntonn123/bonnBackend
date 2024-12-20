import mongoose, { Schema } from "mongoose";

const catagorySchema = new Schema(
    {
        catagory: { type: String, required: true },
        catagoryPic: { type: String, required: true },
        catagoryDesc: { type: String, required: true },
    },
    {
        timestamps: true
    }
)

export const Catagory = mongoose.model("Catagory", catagorySchema)