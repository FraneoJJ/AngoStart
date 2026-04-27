import { requestJson } from "./httpClient";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

function getAuthHeaders() {
  const token = localStorage.getItem("angostart_token");
  if (!token) {
    throw new Error("Sem token. Faça login para gerir progresso da ideia.");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function createIdeaProgress(payload) {
  const data = await requestJson(`${API_BASE}/idea-progress`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return data.progress;
}

export async function getIdeaProgress(ideaId) {
  const data = await requestJson(`${API_BASE}/idea-progress/${encodeURIComponent(ideaId)}`, {
    headers: getAuthHeaders(),
  });
  return data.progress || [];
}
