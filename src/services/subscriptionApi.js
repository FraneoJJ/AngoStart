const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";
import { requestJson } from "./httpClient";

function getTokenOrThrow() {
  const token = localStorage.getItem("angostart_token");
  if (!token) {
    throw new Error("Sem token. Faça login para gerir assinatura.");
  }
  return token;
}

export async function getSubscriptionPlans() {
  const data = await requestJson(`${API_BASE}/subscription/plans`);
  return data.plans || [];
}

export async function getCurrentSubscription() {
  const token = getTokenOrThrow();
  const data = await requestJson(`${API_BASE}/subscription/current`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.subscription;
}

export async function changeSubscriptionPlan(payload) {
  const token = getTokenOrThrow();
  const data = await requestJson(`${API_BASE}/subscription/change`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return data.subscription;
}
