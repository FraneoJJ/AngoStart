import { pool } from "../config/db.js";

export async function createQuestionnaireSession({ userId, ideaId, context, questions }) {
  const [result] = await pool.execute(
    `INSERT INTO questionnaire_sessions (user_id, idea_id, context_json, questions_json)
     VALUES (?, ?, ?, ?)`,
    [userId || null, ideaId || null, JSON.stringify(context), JSON.stringify(questions)]
  );

  return findQuestionnaireSessionById(result.insertId);
}

export async function findQuestionnaireSessionById(sessionId) {
  const [rows] = await pool.execute(
    `SELECT id, user_id, idea_id, context_json, questions_json, created_at, updated_at
     FROM questionnaire_sessions
     WHERE id = ?
     LIMIT 1`,
    [sessionId]
  );
  return rows[0] || null;
}

export async function upsertAnswers(sessionId, answers = []) {
  for (const item of answers) {
    await pool.execute(
      `INSERT INTO questionnaire_answers (session_id, question_key, answer_text)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE answer_text = VALUES(answer_text), updated_at = CURRENT_TIMESTAMP`,
      [sessionId, item.questionKey, item.answerText ?? null]
    );
  }
}

export async function listAnswersBySessionId(sessionId) {
  const [rows] = await pool.execute(
    `SELECT question_key, answer_text, created_at, updated_at
     FROM questionnaire_answers
     WHERE session_id = ?
     ORDER BY question_key ASC`,
    [sessionId]
  );
  return rows;
}
