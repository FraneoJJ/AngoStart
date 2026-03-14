import { requestJson } from "./httpClient";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

function getAuthHeader() {
  const token = localStorage.getItem("angostart_token");
  if (!token) throw new Error("Sem token de autenticação.");
  return { Authorization: `Bearer ${token}` };
}

export async function getAvailableMentors() {
  const data = await requestJson(`${API_BASE}/admin/mentors`, {
    headers: {
      ...getAuthHeader(),
    },
  });
  return data.mentors || [];
}

export async function getMentorById(mentorId) {
  const data = await requestJson(`${API_BASE}/admin/mentors/${encodeURIComponent(mentorId)}`, {
    headers: {
      ...getAuthHeader(),
    },
  });
  return data.mentor || null;
}
