const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";
import { requestJson } from "./httpClient";

function getAuthHeader() {
  const token = localStorage.getItem("angostart_token");
  if (!token) throw new Error("Sem token de autenticação.");
  return { Authorization: `Bearer ${token}` };
}

export async function analyzeViability(payload) {
  const data = await requestJson(`${API_BASE}/analysis/viability`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(payload),
  });

  return data.report;
}

export async function getLatestViabilityReport(ideaId) {
  const data = await requestJson(`${API_BASE}/analysis/viability/${encodeURIComponent(ideaId)}/latest`, {
    headers: { ...getAuthHeader() },
  });
  return data.report || null;
}
