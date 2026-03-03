const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

export async function createIdea(payload) {
  const token = localStorage.getItem("angostart_token");
  if (!token) {
    throw new Error("Sem token. Faça login para submeter ideias na API.");
  }

  const res = await fetch(`${API_BASE}/ideas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Falha ao criar ideia.");
  }
  return data.idea;
}
