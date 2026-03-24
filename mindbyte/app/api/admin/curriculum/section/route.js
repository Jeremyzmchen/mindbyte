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
        return NextResponse.json({ error: error.message }, { status })
    }
}

export async function POST(request) {
    await dbConnect();
    try {
        const body = await request.json();
        const { search, newSection } = body;
        console.log("{search, newSection}", { search, newSection });


        const curriculum = await Curriculum.findById({ _id: search });
        if (!curriculum) {
            return NextResponse.json({ error: "Not found" })
        }
        curriculum.sections.push(newSection)

        const saved = await curriculum.save();
        const newAddedSection = curriculum.sections[curriculum.sections.length - 1];
        return NextResponse.json({ newAddedSection });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}