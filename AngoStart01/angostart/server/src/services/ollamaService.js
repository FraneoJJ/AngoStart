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

export async function generateJsonWithOllama(prompt) {
  const endpoint = `${env.OLLAMA_BASE_URL.replace(/\/+$/, "")}/api/generate`;
  const model = env.OLLAMA_MODEL;
  if (!model) {
    return { data: null, error: "Modelo Ollama não configurado." };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        format: "json",
        options: {
          temperature: 0.2,
        },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return { data: null, error: `Ollama HTTP ${response.status}: ${text || "falha sem detalhe"}` };
    }

    const json = await response.json();
    const parsed = safeParseJson(String(json?.response || "").trim());
    if (!parsed) {
      return { data: null, error: "Resposta do Ollama não retornou JSON válido." };
    }
    return { data: parsed, error: "" };
  } catch (err) {
    return { data: null, error: err?.message || "Falha ao conectar no Ollama." };
  }
}
