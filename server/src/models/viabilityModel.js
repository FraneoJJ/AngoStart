import { pool } from "../config/db.js";

export async function createViabilityReport(data) {
  const [result] = await pool.execute(
    `INSERT INTO viability_reports
      (idea_id, session_id, viability_status, score, strengths_json, weaknesses_json, adjustments_json, summary)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.ideaId || null,
      data.sessionId || null,
      data.viabilityStatus,
      data.score,
      JSON.stringify(data.strengths || []),
      JSON.stringify(data.weaknesses || []),
      JSON.stringify(data.adjustments || []),
      data.summary || null,
    ]
  );

  return findViabilityReportById(result.insertId);
}

export async function findViabilityReportById(id) {
  const [rows] = await pool.execute(
    `SELECT id, idea_id, session_id, viability_status, score, strengths_json, weaknesses_json, adjustments_json, summary, created_at
     FROM viability_reports
     WHERE id = ?
     LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}
