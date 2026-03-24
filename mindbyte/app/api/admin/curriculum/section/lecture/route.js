import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Curriculum from "@/models/Curriculum";
import slugify from "slugify";

export async function POST(requst, context) {
    await dbConnect();
    const body = await requst.json();
    const { newLecture, search, sectionId } = body;

    try {
        const curriculum = await Curriculum.findById(search)
        if (!curriculum) {
            return NextResponse.json({ error: "Curriculum not found" }, { status: 500 })
        }
        
        // mongoose 子文档的根据id查找方法
        const section = curriculum.sections.id(sectionId)
        if (!section) {
            return NextResponse.json({ error: "Section not found" }, { status: 500 })
        }

        const slug = slugify(newLecture?.title)
        section.lectures.push({ ...newLecture, slug })
        await curriculum.save()
        const newAddedLectures = section.lectures[section.lectures.length - 1]
        return NextResponse.json(newAddedLectures)

    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
