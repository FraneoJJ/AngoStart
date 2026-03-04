const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";
import { requestJson } from "./httpClient";

export async function generateQuestionnaire(contextPayload) {
  const data = await requestJson(`${API_BASE}/questionnaire/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ context: contextPayload }),
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });
  return data;
}
