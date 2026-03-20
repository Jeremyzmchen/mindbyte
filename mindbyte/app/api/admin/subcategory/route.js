import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import slugify from "slugify";
import subcategory from "@/models/SubCategory";


export async function GET(request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const parent = searchParams.get('parent');
        const query = parent ? { parent } : {};
        const subcategories = await subcategory.find(query).sort({ createdAt: -1 });
        return NextResponse.json(subcategories);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    await dbConnect();
    const body = await request.json()
    const { name, parent } = body
    console.log('POST body:', { name, parent });
    
    try {
        const newSubCategory= await subcategory.create({
            name,
            parent,
            slug: slugify(name, { lower: true }),
        });
        return NextResponse.json(newSubCategory);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
