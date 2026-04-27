import { pool } from "../config/db.js";

export async function upsertLegalStepProgress({
  userId,
  ideaId,
  stepKey,
  completed,
  notes,
}) {
  await pool.execute(
    `INSERT INTO legal_checklist_progress
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

export async function listLegalProgressByUser({ userId, ideaId }) {
  const hasIdea = Number.isInteger(ideaId) && ideaId > 0;
  const [rows] = await pool.execute(
    `SELECT step_key, completed, notes, completed_at, updated_at
     FROM legal_checklist_progress
     WHERE user_id = ? AND ${hasIdea ? "idea_id = ?" : "idea_id IS NULL"}
     ORDER BY updated_at DESC`,
    hasIdea ? [userId, ideaId] : [userId]
  );

  return rows;
}

export async function createCompanyGuideRecord({
  userId,
  ideaId,
  businessSector,
  partnerCount,
  estimatedMonthlyRevenue,
  hasForeignPartner,
  recommendedType,
  estimatedOpeningDays,
  estimatedCostAoa,
  notes,
  resultJson,
}) {
  const [result] = await pool.execute(
    `INSERT INTO legal_company_guides
      (user_id, idea_id, business_sector, partner_count, estimated_monthly_revenue, has_foreign_partner,
       recommended_type, estimated_opening_days, estimated_cost_aoa, notes, result_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      ideaId || null,
      businessSector || null,
      partnerCount,
      estimatedMonthlyRevenue,
      hasForeignPartner ? 1 : 0,
      recommendedType,
      estimatedOpeningDays,
      estimatedCostAoa,
      notes || null,
      JSON.stringify(resultJson || {}),
    ]
  );

  return result.insertId;
}

export async function getLatestCompanyGuideByUser({ userId }) {
  const [rows] = await pool.execute(
    `SELECT *
     FROM legal_company_guides
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}
