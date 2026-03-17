import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";
import Category from "@/models/Category";

import slugify from "slugify";


export async function GET() {
    await dbConnect();
    try {
        const categories = await Category.find({}).sort({ createdAt: -1 });
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    await dbConnect();
    const body = await request.json()
    const { name } = body
    
    try {
        const category = await Category.create({
            name,
            slug: slugify(name, { lower: true }),
        });
        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
