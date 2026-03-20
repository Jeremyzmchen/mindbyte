import mongoose from 'mongoose'
import Category from './Category';
import SubCategory from "./SubCategory";


const ItemSchema = new mongoose.Schema(
    {
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        subcategoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubCategory',
            required: true,
        },
        title: {
            type: String,

        },
        subtitle: {
            type: String,


        },
        slug: {
            type: String,
            required: true,
            trim: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true, 
    }
);



export default mongoose.models.Item || mongoose.model("Item", ItemSchema);