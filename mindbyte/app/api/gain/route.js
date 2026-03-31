import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import dbConnect from "@/utils/dbConnect";
import SubscriptionOrder from "@/models/SubscriptionOrder";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const GAIN_PROMPT = (articleContent) => `
You are an expert educator. Provide a deep-dive explanation of the following article in under 300 words.
Follow these rules:
- Use **bold** to highlight key concepts, terms, and important ideas
- Break it into clear sections with ### headings where appropriate
- Explain the "why" behind concepts, not just the "what"
- Include practical implications or real-world relevance where possible
- End with a "**Deep Insight:**" line that offers a non-obvious observation about the topic

Article:
${articleContent}
`;

export async function POST(req) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ err: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const active = await SubscriptionOrder.findOne({
        userId: session.user._id,
        orderStatus: "Paid",
        "plan.expiresAt": { $gt: now },
    });

    if (!active) {
        return NextResponse.json({ err: "Subscription required" }, { status: 403 });
    }

    const { content } = await req.json();

    const stream = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: GAIN_PROMPT(content) }],
        stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
        async start(controller) {
            for await (const chunk of stream) {
                const text = chunk.choices[0]?.delta?.content || "";
                if (text) controller.enqueue(encoder.encode(text));
            }
            controller.close();
        },
    });

    return new Response(readable, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
}
