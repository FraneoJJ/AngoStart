import { GoogleGenerativeAI } from "@google/generative-ai";
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
  const apiKey = String(env.GOOGLE_AI_STUDIO_API_KEY || "").trim();
  if (!apiKey) {
    return { data: null, error: "GOOGLE_AI_STUDIO_API_KEY não configurada." };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: env.GEMINI_MODEL || "gemini-1.5-flash" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: Number(options.temperature ?? 0.2),
        responseMimeType: "application/json",
      },
    });

    const text = result?.response?.text?.() || "";
    const parsed = safeParseJson(String(text).trim());
    if (!parsed) {
      return { data: null, error: "Resposta do Gemini não retornou JSON válido." };
    }
    return { data: parsed, error: "" };
  } catch (err) {
    return { data: null, error: err?.message || "Falha ao conectar ao Google Generative AI." };
  }
}
