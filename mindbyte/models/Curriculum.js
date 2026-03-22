import mongoose from "mongoose";


const SectionSchema = new mongoose.Schema({
    idIndex: {
        type: String,
    },
    title: {
        type: String,
        required: true,
    },
    lectures: [{
        idIndex: {
            type: String,
        },
        title: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            default: "",
        },
        content: {
            type: String,
            default: "",

        },
        videoUrl: {
            type: String,
            default: "",
        },
        date: {
            type: Date,
            default: Date.now,
        },
    }],
}, { timestamps: true })

const CurriculumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sections: [SectionSchema],
}, { timestamps: true })

export default mongoose.models.Curriculum || mongoose.model("Curriculum", CurriculumSchema);