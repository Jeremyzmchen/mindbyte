import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Curriculum from "@/models/Curriculum";
import slugify from "slugify";

export async function PUT(request, context) {
    const { id } = await context.params;
    const lectureId = id;
    await dbConnect()
    const body = await request.json()
    const { updatedLecture, sectionId, search } = body

    try {
        const curriculum = await Curriculum.findById(search)
        if (!curriculum) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        const section = curriculum.sections.id(sectionId)
        if (!section) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        const lectureIndex = section?.lectures.findIndex(
            (lecture) => lecture._id.toString() === lectureId.toString()
        )

        if (lectureIndex === -1) {
            return NextResponse.json({ error: "lecture not found" }, { status: 500 })
        }

        const slug = slugify(updatedLecture?.title)
        updatedLecture.slug = slug

        section.lectures[lectureIndex] = updatedLecture
        await curriculum.save()

        return NextResponse.json(curriculum)

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}


export async function DELETE(request, context) {
    const { id } = await context.params;
    const lectureId = id;
    await dbConnect();
    const body = await request.json();

    try {
        const { sectionId, search } = body
        const curriculum = await Curriculum.findById(search)
        if (!curriculum) {
            return NextResponse.json({ error: "curriculum not found" }, { status: 500 })
        }

        const section = curriculum.sections.id(sectionId)
        if (!section) {
            return NextResponse.json({ error: "section not found" }, { status: 500 })
        }

        section.lectures = section.lectures.filter(
            (lecture) => lecture?._id.toString() !== lectureId.toString()
        )

        await curriculum.save()
        return NextResponse.json(curriculum)

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}