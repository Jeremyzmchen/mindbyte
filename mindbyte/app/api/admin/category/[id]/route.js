import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";
import Category from "@/models/Category";

export async function PUT(request, context) {
    await dbConnect();
    const body = await request.json();

    try {
        const { _id, ...updateBody } = body
        const id = context.params.id
        const updatingCategory = await Category.findByIdAndUpdate(id, updateBody, { new: true });
        return NextResponse.json(updatingCategory);

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, context) {
    await dbConnect();

    try {
        const deletingCategory = await Category.findByIdAndDelete(context.params.id);
        return NextResponse.json(deletingCategory);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}