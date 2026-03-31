import { pool } from "../config/db.js";

export async function upsertStrategicStepProgress({
  userId,
  ideaId,
  stepKey,
  completed,
  notes,
}) {
  await pool.execute(
    `INSERT INTO strategic_checklist_progress
      (user_id, idea_id, step_key, completed, notes, completed_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      completed = VALUES(completed),
      notes = VALUES(notes),
      completed_at = VALUES(completed_at),
      updated_at = CURRENT_TIMESTAMP`,
    [
      userId,
      ideaId || null,
      stepKey,
      completed ? 1 : 0,
      notes || null,
      completed ? new Date() : null,
    ]
  );
}

export async function listStrategicProgressByUser({ userId, ideaId }) {
  const hasIdea = Number.isInteger(ideaId) && ideaId > 0;
  const [rows] = await pool.execute(
    `SELECT step_key, completed, notes, completed_at, updated_at
     FROM strategic_checklist_progress
     WHERE user_id = ? AND ${hasIdea ? "idea_id = ?" : "idea_id IS NULL"}
     ORDER BY updated_at DESC`,
    hasIdea ? [userId, ideaId] : [userId]
  );
  return rows;
}
