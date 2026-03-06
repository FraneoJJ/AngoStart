import { requestJson } from "./httpClient";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

export async function registerUser(payload) {
  return requestJson(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
