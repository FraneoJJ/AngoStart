import { requestJson } from "./httpClient";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

function getAuthHeader() {
  const token = localStorage.getItem("angostart_token");
  if (!token) throw new Error("Sem token de autenticação.");
  return { Authorization: `Bearer ${token}` };
}

export async function createMentorshipRequest(payload) {
  const data = await requestJson(`${API_BASE}/mentorship/requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  return data.request || null;
}

export async function getMyMentorshipRequests() {
  const data = await requestJson(`${API_BASE}/mentorship/requests/mine`, {
    headers: { ...getAuthHeader() },
  });
  return data.requests || [];
}

export async function getMentorMentorshipRequests() {
  const data = await requestJson(`${API_BASE}/mentorship/mentor/requests`, {
    headers: { ...getAuthHeader() },
  });
  return data.requests || [];
}

export async function updateMentorMentorshipRequest(requestId, payload) {
  const data = await requestJson(`${API_BASE}/mentorship/mentor/requests/${encodeURIComponent(requestId)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });
  return data.request || null;
}
