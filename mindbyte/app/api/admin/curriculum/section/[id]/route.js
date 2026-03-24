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

export async function DELETE(request, context) {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    await dbConnect();

    try {
        const deletingCurriculum = await Curriculum.findById(search);
        if (!deletingCurriculum) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        deletingCurriculum.sections = deletingCurriculum.sections.filter(
            (section) => section._id.toString() !== id
        );

        await deletingCurriculum.save();
        return NextResponse.json({ success: true });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request, context) {
    const { id } = await context.params;
    const sectionId = id;
    await dbConnect();
    const body = await request.json();
    const { updatedSection, search } = body

    try {
        console.log("search:", search);
        console.log("sectionId:", sectionId);
        console.log("updatedSection:", updatedSection);

        const updatingCurriculum = await Curriculum.findById(search);
        if (!updatingCurriculum) {
            return NextResponse.json({ error: "Not found" }, { status: 500 });
        }

        const sectionIndex = updatingCurriculum.sections.findIndex(
            (section) => section?._id.toString() === sectionId.toString()
        )

        if (sectionIndex === -1) {
            return NextResponse.json({ error: "section not found" })
        }

        updatingCurriculum.sections.set(sectionIndex, updatedSection)
        await updatingCurriculum.save();
        return NextResponse.json(updatingCurriculum);

    } catch (error) {
        console.log("完整错误:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

}