import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Curriculum from "@/models/Curriculum";

export async function GET(request, context) {
    const { id } = await context.params;
    await dbConnect();

    try {
        const curriculumItem = await Curriculum.findById(id);
        console.log("curriculumItem", curriculumItem)
        return NextResponse.json(curriculumItem);



    } catch (error) {
        console.log("Failed to fetch curriculum details", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}