import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import subcategory from "@/models/SubCategory";

export async function PUT(request, context) {
    await dbConnect();
    const { id } = await context.params; 
    const body = await request.json();

    try {
        const { _id, ...updateBody } = body;
        const updatingSubCategory = await subcategory.findByIdAndUpdate(
            id, 
            updateBody,
            { returnDocument: 'after' }
        );
        return NextResponse.json(updatingSubCategory);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, context) {
    await dbConnect();
    const { id } = await context.params; 

    try {
        const deletingSubCategory = await subcategory.findByIdAndDelete(id);
        return NextResponse.json(deletingSubCategory);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}