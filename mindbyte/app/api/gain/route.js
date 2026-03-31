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
