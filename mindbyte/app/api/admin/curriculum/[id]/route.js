import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Curriculum from "@/models/Curriculum";
import slugify from "slugify";


export async function PUT(request, context) {
    const { id } = await context.params;
    await dbConnect();
    const body = await request.json();

    try {
        const slug = slugify(body.title, { lower: true })
        body.slug = slug
        const updatingCurriculum = await Curriculum.findByIdAndUpdate(
            id,
            body,
            { new: true }
        );

        return NextResponse.json(updatingCurriculum);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function DELETE(request, context) {
    const { id } = await context.params;
    await dbConnect();
    try {
        const deletingCurriculum = await Curriculum.findByIdAndDelete({ _id: id });
        console.log("deletingCurriculum", deletingCurriculum);
        return NextResponse.json(deletingCurriculum);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}