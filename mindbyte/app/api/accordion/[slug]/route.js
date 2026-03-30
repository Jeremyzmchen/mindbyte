import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Curriculum from "@/models/Curriculum";


export async function GET(request, context) {

    await dbConnect();

    const { slug } = await context.params;
    if (!slug || typeof slug !== "string") {
        return NextResponse.json({
            error: "Invalid or missing slug param"
        }, { status: 500 })
    }


    try {
        // 先按 lecture slug 查找对应课程
        let curriculum = await Curriculum.findOne({
            "sections.lectures.slug": slug
        })

        // 如果没找到，尝试按课程本身的 slug 查找
        if (!curriculum) {
            curriculum = await Curriculum.findOne({ slug })
        }

        if (!curriculum) {
            return NextResponse.json({ error: "Curriculum not found" }, { status: 500 });
        }

        // 返回该课程的所有 sections（供左侧目录渲染）
        return NextResponse.json({ sections: curriculum.sections })

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch curriculum" }, { status: 500 });
    }
}

