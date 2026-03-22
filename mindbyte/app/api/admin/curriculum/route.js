import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import slugify from "slugify";

import Curriculum from "@/models/Curriculum";


export async function GET() {
    await dbConnect();
    try {
        const gettingCurriculums = await Curriculum.find({}).sort({ createdAt: -1 });
        console.log("gettingCurriculums", gettingCurriculums)
        return NextResponse.json(gettingCurriculums);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    await dbConnect();
    const body = await request.json()

    try {
        const slug = slugify(body.title, { lower: true })
        body.slug = slug
        const postingCurriculum = await Curriculum.create(body)
        return NextResponse.json(postingCurriculum);


    } catch (error) {
        console.log("fetching curriculums error", error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}