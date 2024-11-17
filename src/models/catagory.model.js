import mongoose, { Schema } from "mongoose";

const catagorySchema = new Schema(
    {
        catagory: String,
    },
    {
        timestamps: true
    }
)

export const Catagory = mongoose.model("Catagory", catagorySchema)