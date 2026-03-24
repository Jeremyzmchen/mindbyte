import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Curriculum from "@/models/Curriculum";

// 接收新的 section 顺序，按传入的 id 数组重排 curriculum.sections
export async function PUT(request) {
    await dbConnect();
    const body = await request.json();
    const { search, sectionIds } = body;

    try {
        const curriculum = await Curriculum.findById(search);
        if (!curriculum) {
            return NextResponse.json({ error: "Curriculum not found" }, { status: 404 });
        }

        const reordered = sectionIds.map((id) =>
            curriculum.sections.find((s) => s._id.toString() === id)
        ).filter(Boolean);

        curriculum.sections = reordered;
        await curriculum.save();

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
