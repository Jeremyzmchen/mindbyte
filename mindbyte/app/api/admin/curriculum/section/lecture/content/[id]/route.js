import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Curriculum from "@/models/Curriculum";


export async function PUT(request, context) {
    const { id } = await context.params
    const lectureId = id
    await dbConnect();
    const body = await request.json();

    try {
        const { sectionId, lectureItem, search, } = body

        const curriculum = await Curriculum.findById(search)
        if (!curriculum) {
            return NextResponse.json({ error: "Curriculum not found" }, { status: 404 });
        }

        const section = curriculum.sections.id(sectionId);
        if (!section) {
            return NextResponse.json({ error: "Section not found" }, { status: 404 });
        }

        const lectureIndex = section.lectures.findIndex(
            (lecture) => lecture?._id.toString() === lectureId.toString()
        )
        if (lectureIndex === -1) {
            return NextResponse.json({ error: "Lecture not found" }, { status: 404 });
        }

        section.lectures[lectureIndex] = lectureItem
        await curriculum.save()
        return NextResponse.json(curriculum, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}