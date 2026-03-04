const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";
import { requestJson } from "./httpClient";

export async function createIdea(payload) {
  const token = localStorage.getItem("angostart_token");
  if (!token) {
    throw new Error("Sem token. Faça login para submeter ideias na API.");
  }

  const data = await requestJson(`${API_BASE}/ideas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return data.idea;
}

export async function getMarketplaceIdeas() {
  const data = await requestJson(`${API_BASE}/ideas/marketplace`);
  return data.ideas || [];
}

export async function getMyIdeas() {
  const token = localStorage.getItem("angostart_token");
  if (!token) {
    throw new Error("Sem token. Faça login para ver suas ideias.");
  }
  const data = await requestJson(`${API_BASE}/ideas/mine`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.ideas || [];
}

export async function updateIdeaStatus(ideaId, status) {
  const token = localStorage.getItem("angostart_token");
  if (!token) {
    throw new Error("Sem token. Faça login para atualizar status da ideia.");
  }
  const data = await requestJson(`${API_BASE}/ideas/${ideaId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  return data.idea;
}
