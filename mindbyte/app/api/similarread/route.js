import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Curriculum from "@/models/Curriculum";
import SubCategory from "@/models/SubCategory";

export async function GET() {
    await dbConnect();

    try {
        const curriculums = await Curriculum.find({}).sort({ createdAt: -1 });
        const subCategory = await SubCategory.find({}).sort({ createdAt: -1 });

        return NextResponse.json({ curriculums, subCategory });
    } catch (err) {
        return NextResponse.json({ err: err.message }, { status: 500 });
    }
}
