import mongoose, {Schema} from "mongoose";

const addressSchema = new Schema(
    {
        userId: {
                type: Schema.Types.ObjectId,
                ref: "User"
        },
        houseName: {
            type: String,
            lowercase: true,
            trim: true,
        },
        houseNumber: {
            type: String,
            lowercase: true,
            required: [true, "House Number Cannot Be Empty"],
            trim: true,
        },
        streetName: {
            type: String,
            lowercase: true,
            required: [true, "Street Name Cannot Be Empty"],
            trim: true,
        },
        city: {
            type: String,
            lowercase: true,
            required: [true, "City Cannot Be Empty"],
            trim: true,
        },
        landmark: {
            type: String,
            lowercase: true,
            required: [true, "Landmark Cannot Be Empty"],
            trim: true,
        },
        phone: {
            type: Number,
            required: [true, "Phone Number Cannot Be Empty"],
            min: [1000000000, 'Phone number must be at least 10 digits long.'],
            max: [9999999999, 'Phone number cannot exceed 10 digits.'],
        },
        pincode: {
            type: Number,
            required: [true, "Pin Code Cannot Be Empty"],
            min: [100000, 'Pin Code must be at least 6 digits long.'],
            max: [999999, 'Pin Code cannot exceed 6 digits.'],
        }
    },
    {
        timestamps: true
    }
)

export const Address = mongoose.model("Address", addressSchema)