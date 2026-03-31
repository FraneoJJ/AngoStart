const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";
import { requestJson } from "./httpClient";

function getAuthHeader() {
  const token = localStorage.getItem("angostart_token");
  if (!token) throw new Error("Sem token de autenticação.");
  return { Authorization: `Bearer ${token}` };
}

export async function generateQuestionnaire(payload) {
  const requestPayload = payload?.context ? payload : { context: payload };
  const data = await requestJson(`${API_BASE}/questionnaire/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(requestPayload),
  });
  return data.session;
}

export async function saveQuestionnaireAnswers(sessionId, answersMap) {
  const answers = Object.entries(answersMap).map(([questionKey, answerText]) => ({
    questionKey,
    answerText: String(answerText ?? ""),
  }));

  const data = await requestJson(`${API_BASE}/questionnaire/${sessionId}/answers`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify({ answers }),
  });
  return data;
}
