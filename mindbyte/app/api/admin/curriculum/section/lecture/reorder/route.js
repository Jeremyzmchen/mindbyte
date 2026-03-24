import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Curriculum from "@/models/Curriculum";

// 接收新的 lecture 顺序，按传入的 id 数组重排指定 section 下的 lectures
export async function PUT(request) {
    await dbConnect();
    const body = await request.json();
    const { search, sectionId, lectureIds } = body;

    try {
        const curriculum = await Curriculum.findById(search);
        if (!curriculum) {
            return NextResponse.json({ error: "Curriculum not found" }, { status: 404 });
        }

        const section = curriculum.sections.id(sectionId);
        if (!section) {
            return NextResponse.json({ error: "Section not found" }, { status: 404 });
        }

        const reordered = lectureIds.map((id) =>
            section.lectures.find((l) => l._id.toString() === id)
        ).filter(Boolean);

        section.lectures = reordered;
        await curriculum.save();

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
