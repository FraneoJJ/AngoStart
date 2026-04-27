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

export async function updateAdminUserVerification(userId, status, role) {
  const data = await requestJson(`${API_BASE}/admin/users/${encodeURIComponent(userId)}/verification`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ status, role }),
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

export async function createAdmin({ name, email, password, adminCategory = "secondary" }) {
  const data = await requestJson(`${API_BASE}/admin/admins`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ name, email, password, adminCategory }),
  });
  return data || null;
}

export async function removeSecondaryAdmin(adminId) {
  const data = await requestJson(`${API_BASE}/admin/admins/${encodeURIComponent(adminId)}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeader(),
    },
  });
  return data?.result || null;
}
