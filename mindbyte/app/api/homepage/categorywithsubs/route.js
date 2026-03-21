import { NextResponse } from "next/server"; 
import dbConnect from "@/utils/dbConnect";  
import CategoryWithSubs from "@/models/CategoryWithSubs";  
import SubCategory from "@/models/SubCategory"; 
export async function GET() {
  await dbConnect();

  try {
    const res = await CategoryWithSubs.find({})
      .sort({ createdAt: -1 }) 
      .populate("categoryId") 
      .populate("subcategoryId");

    return NextResponse.json(res);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}