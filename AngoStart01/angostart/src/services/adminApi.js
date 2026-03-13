import { requestJson } from "./httpClient";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

function getAuthHeader() {
  const token = localStorage.getItem("angostart_token");
  if (!token) throw new Error("Sem token de autenticação.");
  return { Authorization: `Bearer ${token}` };
}

export async function getAdminUsers() {
  const data = await requestJson(`${API_BASE}/admin/users`, {
    headers: {
      ...getAuthHeader(),
    },
  });
  return data.users || [];
}

export async function updateAdminUserVerification(userId, status) {
  const data = await requestJson(`${API_BASE}/admin/users/${encodeURIComponent(userId)}/verification`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ status }),
  });
  return data.user;
}

export async function getAdminIdeas() {
  const data = await requestJson(`${API_BASE}/admin/ideas`, {
    headers: {
      ...getAuthHeader(),
    },
  });
  return data.ideas || [];
}
