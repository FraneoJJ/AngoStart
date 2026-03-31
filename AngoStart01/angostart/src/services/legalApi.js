const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";
import { requestJson } from "./httpClient";

export async function getLegalFlow(track = "empresa_angola") {
  const data = await requestJson(`${API_BASE}/legal/flow?track=${encodeURIComponent(track)}`);
  return data.steps;
}

export async function getLegalProgress() {
  const token = localStorage.getItem("angostart_token");
  if (!token) return [];

  const data = await requestJson(`${API_BASE}/legal/progress`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.progress;
}

export async function updateLegalProgress(payload) {
  const token = localStorage.getItem("angostart_token");
  if (!token) {
    throw new Error("Sem token para guardar progresso legal.");
  }

  await requestJson(`${API_BASE}/legal/progress`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return true;
}

export async function generateCompanyGuide(payload) {
  const token = localStorage.getItem("angostart_token");
  if (!token) {
    throw new Error("Sem token para gerar orientação legal.");
  }

  const data = await requestJson(`${API_BASE}/legal/company-guide`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return data.guide;
}

export async function getLatestCompanyGuide() {
  const token = localStorage.getItem("angostart_token");
  if (!token) return null;

  const data = await requestJson(`${API_BASE}/legal/company-guide/latest`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.guide || null;
}
