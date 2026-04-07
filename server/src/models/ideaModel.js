import { pool } from "../config/db.js";

export async function createIdea(data) {
  const [result] = await pool.execute(
    `INSERT INTO ideas
      (title, description, sector, city, address, region, latitude, longitude, initial_capital, problem, differential_text, target_audience, status, approval_status, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.title,
      data.description,
      data.sector,
      data.city,
      data.address,
      data.region,
      data.latitude,
      data.longitude,
      data.initialCapital,
      data.problem,
      data.differentialText,
      data.targetAudience,
      data.status,
      data.approvalStatus || "pending",
      data.createdBy,
    ]
  );

  return findIdeaById(result.insertId);
}

export async function findIdeaById(id) {
  const [rows] = await pool.execute(
    `SELECT i.*,
            u.name AS owner_name,
            u.email AS owner_email,
            u.role AS owner_role
     FROM ideas i
     INNER JOIN users u ON u.id = i.created_by
     WHERE i.id = ?
     LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

export async function listIdeasByOwner(ownerId) {
  const [rows] = await pool.execute(
    `SELECT id, title, description, sector, city, address, region, latitude, longitude,
            initial_capital, problem, differential_text, target_audience, status, approval_status, created_at, updated_at,
            (
              SELECT vr.score
              FROM viability_reports vr
              WHERE vr.idea_id = ideas.id
              ORDER BY vr.created_at DESC
              LIMIT 1
            ) AS viability_score
     FROM ideas
     WHERE created_by = ?
     ORDER BY created_at DESC`,
    [ownerId]
  );
  return rows;
}

export async function updateIdeaById(id, data) {
  await pool.execute(
    `UPDATE ideas
     SET title = ?, description = ?, sector = ?, city = ?, address = ?, region = ?, latitude = ?, longitude = ?,
         initial_capital = ?, problem = ?, differential_text = ?, target_audience = ?, status = ?, approval_status = ?
     WHERE id = ?`,
    [
      data.title,
      data.description,
      data.sector,
      data.city,
      data.address,
      data.region,
      data.latitude,
      data.longitude,
      data.initialCapital,
      data.problem,
      data.differentialText,
      data.targetAudience,
      data.status,
      data.approvalStatus || "pending",
      id,
    ]
  );

  return findIdeaById(id);
}

export async function updateIdeaStatusById(id, status) {
  await pool.execute(
    `UPDATE ideas
     SET status = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [status, id]
  );
  return findIdeaById(id);
}

export async function updateIdeaApprovalStatusById(id, approvalStatus) {
  await pool.execute(
    `UPDATE ideas
     SET approval_status = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [approvalStatus, id]
  );
  return findIdeaById(id);
}

export async function listMarketplaceIdeas() {
  const [rows] = await pool.execute(
    `SELECT i.id, i.title, i.description, i.sector, i.city, i.region, i.latitude, i.longitude,
            i.initial_capital, i.status, i.approval_status, i.created_at, u.name AS owner_name, u.avatar_url AS owner_avatar_url,
            i.created_by AS owner_user_id,
            (
              SELECT vr.score
              FROM viability_reports vr
              WHERE vr.idea_id = i.id
              ORDER BY vr.created_at DESC
              LIMIT 1
            ) AS viability_score,
            (
              SELECT vr.viability_status
              FROM viability_reports vr
              WHERE vr.idea_id = i.id
              ORDER BY vr.created_at DESC
              LIMIT 1
            ) AS viability_status
     FROM ideas i
     INNER JOIN users u ON u.id = i.created_by
     WHERE i.status IN ('submitted', 'active')
     ORDER BY created_at DESC`
  );
  return rows;
}

export async function findLatestIdeaViabilityScore(id) {
  const [rows] = await pool.execute(
    `SELECT vr.score
     FROM viability_reports vr
     WHERE vr.idea_id = ?
     ORDER BY vr.created_at DESC, vr.id DESC
     LIMIT 1`,
    [id]
  );
  return rows[0]?.score ?? null;
}

export async function syncIdeaApprovalByScore(id, score) {
  const n = Number(score || 0);
  let approvalStatus = "pending";
  let status = "submitted";
  if (n >= 80) {
    approvalStatus = "approved";
    status = "submitted";
  } else if (n >= 50) {
    approvalStatus = "pending";
    status = "submitted";
  } else {
    approvalStatus = "rejected";
    status = "archived";
  }
  await pool.execute(
    `UPDATE ideas
     SET approval_status = ?, status = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [approvalStatus, status, id]
  );
  return findIdeaById(id);
}
