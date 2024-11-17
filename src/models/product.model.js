import mongoose, {Schema} from "mongoose";

const productSchema = new Schema(
    {
        catagory: {
            type: Schema.Types.ObjectId,
            ref: "Catagory",
        },
        variant: [
            {
                id: { type: String },
                variantName: { type: String, required: true },
                variantPrice: { type: Number, required: true },
                variantPic_1: { type: String, required: true },
                variantPic_2: { type: String, required: true },  
                variantPic_3: { type: String, required: true },  
                variantPic_4: { type: String, required: true },
                variantDesc: { type: String, required: true },
                foodType: { type: String, required: true },
                active: { type: Boolean, default: true}
            }
        ],
        boxSize: [
             { 
                boxId: { type: String },
                boxType: { type: String },
                boxPrice: { type: Number }
            },
        ],
        allIndiaDelivery: {
            type: Boolean,
            default: false
        },
        storage: {
            type: String
        },
        allergens: {
            type: String
        },
        ingredients: {
            type: String
        },
        size: {
            type: String
        },
    },
    {
        timestamps: true
    }
)

export const Product = mongoose.model("Product", productSchema)