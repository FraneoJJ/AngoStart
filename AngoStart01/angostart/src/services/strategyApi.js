const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";
import { requestJson } from "./httpClient";

function getRequiredToken() {
  const token = localStorage.getItem("angostart_token");
  if (!token) {
    throw new Error("Sem token. Faça login novamente.");
  }
  return token;
}

export async function getStrategicChecklist(track = "validacao", context = {}) {
  const token = getRequiredToken();
  const params = new URLSearchParams({
    track,
    sector: context.sector || "",
    city: context.city || "",
    initialCapital: String(Number(context.initialCapital || 0)),
    viabilityScore: String(Number(context.viabilityScore || 0)),
    hasMvp: context.hasMvp ? "true" : "false",
  });
  const data = await requestJson(`${API_BASE}/strategy/checklist?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.steps;
}

export async function getStrategicProgress() {
  const token = getRequiredToken();

  const data = await requestJson(`${API_BASE}/strategy/progress`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.progress;
}

export async function updateStrategicProgress(payload) {
  const token = getRequiredToken();

  await requestJson(`${API_BASE}/strategy/progress`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return true;
}
