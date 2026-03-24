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

        console.log("=== DEBUG ===")
        console.log("lectureId:", lectureId)
        console.log("sectionId:", sectionId)
        console.log("search:", search)
        console.log("lectureItem:", lectureItem)  // 检查 videoUrl 写入
        console.log("=============")

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
        console.log("lectureIndex found:", lectureIndex)
        if (lectureIndex === -1) {
            return NextResponse.json({ error: "Lecture not found" }, { status: 404 });
        }

        console.log("before save:", section.lectures[lectureIndex])

        // mongoose 子文档不能直接赋值，需要用set()方法，要记得这个
        section.lectures[lectureIndex].set(lectureItem)
        await curriculum.save()

        console.log("after save:", section.lectures[lectureIndex])

        return NextResponse.json(curriculum, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}