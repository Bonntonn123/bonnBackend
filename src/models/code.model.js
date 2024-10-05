import mongoose, {Schema} from "mongoose";

const codeSchema = new Schema(
    {
        name: {
            type: String,
        }
    },
    { timestamps: true }
)


export const Code = mongoose.model("Code", codeSchema)