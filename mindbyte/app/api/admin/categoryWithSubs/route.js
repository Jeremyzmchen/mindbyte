import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import CategoryWithSubs from "@/models/CategoryWithSubs";
import SubCategory from "@/models/SubCategory";
import slugify from "slugify";

export async function GET(request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const parent = searchParams.get('parent');
        const query = parent ? { parent } : {};
        const categorywithsubs = await CategoryWithSubs
            .find(query)
            .sort({ createdAt: -1 })
            // 将数据根据mongodb生成的ObjectId联动替换成完整数据
            .populate("categoryId")
            .populate("subcategoryId");
        return NextResponse.json(categorywithsubs);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    await dbConnect();
    const body = await request.json()
    const { categoryId, subcategoryId, title, subtitle } = body
    
    const subcategory = await SubCategory.findOne({ _id: subcategoryId })
    const subcategoryTitle = subcategory?.name
    

    try {
        const categoryWithSubs = await CategoryWithSubs.create({
            categoryId,
            subcategoryId,
            title,
            subtitle,
            slug: slugify(title || subcategoryTitle),
        });
        return NextResponse.json(categoryWithSubs);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
