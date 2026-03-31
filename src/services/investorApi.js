import { requestJson } from "./httpClient";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

function getAuthHeader() {
  const token = localStorage.getItem("angostart_token");
  if (!token) throw new Error("Sem token de autenticação.");
  return { Authorization: `Bearer ${token}` };
}

export async function getAvailableInvestors() {
  const data = await requestJson(`${API_BASE}/admin/investors`, {
    headers: {
      ...getAuthHeader(),
    },
  });
  return data.investors || [];
}

export async function getInvestorById(investorId) {
  const data = await requestJson(`${API_BASE}/admin/investors/${encodeURIComponent(investorId)}`, {
    headers: {
      ...getAuthHeader(),
    },
  });
  return data.investor || null;
}
