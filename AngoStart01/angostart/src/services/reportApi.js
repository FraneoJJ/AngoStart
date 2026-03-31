import { requestJson } from "./httpClient";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

function getAuthHeader() {
  const token = localStorage.getItem("angostart_token");
  if (!token) throw new Error("Sem token de autenticação.");
  return { Authorization: `Bearer ${token}` };
}

export async function getPerformanceReport(month = "") {
  const params = new URLSearchParams();
  if (month) params.set("month", month);
  const suffix = params.toString() ? `?${params.toString()}` : "";
  const data = await requestJson(`${API_BASE}/admin/reports/performance${suffix}`, {
    headers: {
      ...getAuthHeader(),
    },
  });
  return data.report || null;
}
