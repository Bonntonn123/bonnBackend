import mongoose, {Schema} from "mongoose";

const productSchema = new Schema(
    {
        catagory: {
            type: String,
            required: true
        },
        variant: [
            {
                id: { type: String },
                variantName: { type: String, required: true },
                variantPrice: { type: Number, required: true },
                variantPic_1: { type: String, required: true },
                variantPic_2: { type: String, required: true },  
                variantPic_3: { type: String, required: true },  
                variantPic_4: { type: String },
                variantDesc: { type: String, required: true },
                foodType: { type: String, required: true },
                active: { type: Boolean, default: true}
            }
        ],
        boxSize: [
             { 
                boxId: { type: String },
                boxType: { type: String, required: true },
                boxPrice: { type: Number, required: true }
            },
        ],
        allIndiaDelivery: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    }
)

export const Product = mongoose.model("Product", productSchema)