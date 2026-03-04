const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";
import { requestJson } from "./httpClient";

export async function analyzeViability(payload) {
  const data = await requestJson(`${API_BASE}/analysis/viability`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return data.report;
}
