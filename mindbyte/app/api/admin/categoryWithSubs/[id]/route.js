import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import CategoryWithSubs from "@/models/CategoryWithSubs";

export async function PUT(request, context) {
    await dbConnect();
    const body = await request.json();
  
    try {
      const updatingCategory = await CategoryWithSubs.findByIdAndUpdate(
        context.params.id, 
        body, 
        { new: true }
      );
      return NextResponse.json(updatingCategory);
    } catch (err) {
      return NextResponse.json({ err: err.message }, { status: 500 });
    }
  }
  
  export async function DELETE(req, context) {
    await dbConnect();

    try {
      const deletingCategory = await CategoryWithSubs.findByIdAndDelete(
        context.params.id 
      );
      return NextResponse.json(deletingCategory);
    } catch (err) {
      return NextResponse.json({ err: err.message }, { status: 500 });
    }
  }
  