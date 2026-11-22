import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const context = body.businessContext || {};
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Live AI is not configured. Add OPENAI_API_KEY in the deployment environment." },
        { status: 503 }
      );
    }
    const system = [
      "You are the AI business operator inside available.AI.",
      "Help the owner move through a connected Build, Grow, Earn workflow.",
      "Be practical, concise, and specific. Ask at most one important clarifying question at a time.",
      "Never claim to have sent an email, published a website, connected an account, charged a payment, or performed an external action unless a real tool confirms it.",
      "Treat external actions as drafts requiring explicit owner approval.",
      "Business context:",
      "Name: " + (context.name || "Not provided"),
      "Idea: " + (context.idea || "Not provided"),
      "Offer: " + (context.offer || "Not provided")
    ].join("\n");
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [{ role: "system", content: system }].concat(
          messages.slice(-20).map((m: { role: string; content: string }) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: String(m.content || "").slice(0, 12000)
          }))
        ),
        temperature: 0.6
      })
    });
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || "AI provider request failed." }, { status: 502 });
    }
    const reply = data.choices?.[0]?.message?.content;
    if (!reply) return NextResponse.json({ error: "The AI provider returned an empty response." }, { status: 502 });
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
