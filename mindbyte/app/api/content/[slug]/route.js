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
        // 查找slug对应的课程
        let curriculum = await Curriculum.findOne({
            "sections.lectures.slug": slug
        })

        // 当没有查询到子级slug，slug可能是课程本身而不是某个具体的lecture
        if (!curriculum) {
            const curriculum = await Curriculum.findOne({ slug })
            if (!curriculum) {
                return NextResponse.json({ error: "Curriculum not found" }, { status: 500 });
            }

            // 找到课程，为前端页面提供课程的第一个lecture数据作为页面内容
            const firstSection = curriculum.sections[0]
            if (!firstSection) {
                return NextResponse.json({ error: "Section not found" }, { status: 500 });
            }
            const firstLecture = firstSection.lectures[0]
            if (!firstLecture) {
                return NextResponse.json({ error: "Lecture not found" }, { status: 500 });
            }
            return NextResponse.json({ firstLecture })
        }

        // 遍历对应课程的sections找到与slug匹配的lecture
        let matchingLecture = null
        for (const section of curriculum.sections) {
            const lecture = section.lectures.find((lecture) => lecture?.slug === slug);
            if (lecture) {
                matchingLecture = lecture.toObject()
                break;
            }
        }

        if (!matchingLecture) {
            return NextResponse.json({ error: "Lecture not found" }, { status: 500 });
        }

        return NextResponse.json({ matchingLecture })

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch curriculum" }, { status: 500 })
    }
}