import { pool } from "../config/db.js";

export async function createIdea(data) {
  const [result] = await pool.execute(
    `INSERT INTO ideas
      (title, description, sector, city, address, region, latitude, longitude, initial_capital, problem, differential_text, target_audience, status, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
            initial_capital, problem, differential_text, target_audience, status, created_at, updated_at
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
         initial_capital = ?, problem = ?, differential_text = ?, target_audience = ?, status = ?
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
      id,
    ]
  );

  return findIdeaById(id);
}

export async function listMarketplaceIdeas() {
  const [rows] = await pool.execute(
    `SELECT id, title, description, sector, city, region, latitude, longitude,
            initial_capital, status, created_at
     FROM ideas
     WHERE status IN ('submitted', 'active')
     ORDER BY created_at DESC`
  );
  return rows;
}
