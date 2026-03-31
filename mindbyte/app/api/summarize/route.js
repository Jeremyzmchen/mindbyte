import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SUMMARIZE_PROMPT = (articleContent) => `
You are a concise study assistant. Summarize the following article in under 200 words.
Follow these rules:
- Use **bold** to highlight the most important concepts or terms
- Structure the summary with 2-3 short paragraphs
- End with a "**Key Takeaway:**" line that captures the single most important idea
- Be direct and informative, no filler phrases

Article:
${articleContent}
`;

export async function POST(req) {
    const { content } = await req.json();

    const stream = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: SUMMARIZE_PROMPT(content) }],
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
