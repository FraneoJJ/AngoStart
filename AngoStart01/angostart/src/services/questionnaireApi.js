const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

export async function generateQuestionnaire(contextPayload) {
  const res = await fetch(`${API_BASE}/questionnaire/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ context: contextPayload }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Falha ao gerar questionário.");
  }
  return data.session;
}

export async function saveQuestionnaireAnswers(sessionId, answersMap) {
  const answers = Object.entries(answersMap).map(([questionKey, answerText]) => ({
    questionKey,
    answerText: String(answerText ?? ""),
  }));

  const res = await fetch(`${API_BASE}/questionnaire/${sessionId}/answers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Falha ao salvar respostas do questionário.");
  }
  return data;
}
