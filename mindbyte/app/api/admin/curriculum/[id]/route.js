import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Curriculum from "@/models/Curriculum";


export async function PUT(request, context) {
    await dbConnect();
    const body = await request.json();

    try {
        const updatingCurriculum = await Curriculum.findByIdAndUpdate(
            context.params.id,
            body,
            { new: true }
        );

        return NextResponse.json(updatingCurriculum);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function DELETE(request, context) {
    await dbConnect();
    try {
        const deletingCurriculum = await Curriculum.findByIdAndDelete(context.params.id);
        return NextResponse.json(deletingCurriculum);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}