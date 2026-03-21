
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import SubCategory from "@/models/SubCategory"; 
export async function GET() {
  await dbConnect();

  try {
    const subcategories = await SubCategory.find({}).sort({ createdAt: -1 });

    return NextResponse.json(subcategories);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}