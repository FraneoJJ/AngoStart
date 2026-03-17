import { env } from "../config/env.js";

function safeParseJson(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced?.[1]) {
      try {
        return JSON.parse(fenced[1].trim());
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function generateJsonWithGemini(prompt, options = {}) {
  const apiKey = String(env.GROQ_API_KEY || "").trim();
  if (!apiKey) {
    return { data: null, error: "GROQ_API_KEY não configurada." };
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: env.GROQ_MODEL || "llama-3.3-70b-versatile",
        temperature: Number(options.temperature ?? 0.2),
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: String(prompt || "") }],
      }),
    });

    if (!response.ok) {
      let reason = `Groq API HTTP ${response.status}`;
      try {
        const body = await response.json();
        reason = body?.error?.message || reason;
      } catch {
        // ignora parse de erro
      }
      return { data: null, error: reason };
    }

    const payload = await response.json();
    const text = payload?.choices?.[0]?.message?.content || "";
    const parsed = safeParseJson(String(text).trim());
    if (!parsed) {
      return { data: null, error: "Resposta do Groq não retornou JSON válido." };
    }
    return { data: parsed, error: "" };
  } catch (err) {
    return { data: null, error: err?.message || "Falha ao conectar ao Groq Cloud." };
  }
}
