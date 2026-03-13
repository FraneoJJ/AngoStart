import { pool } from "../config/db.js";

export const USER_ROLES = ["admin", "empreendedor", "mentor", "investidor"];

export async function findUserByEmail(email) {
  const [rows] = await pool.execute(
    `SELECT id, name, email, password_hash, role, created_at
     FROM users
     WHERE email = ?
     LIMIT 1`,
    [email]
  );

  return rows[0] || null;
}

export async function findUserPublicById(id) {
  const [rows] = await pool.execute(
    `SELECT id, name, email, role, created_at
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] || null;
}

export async function createUser({ name, email, passwordHash, role }, db = pool) {
  const [result] = await db.execute(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES (?, ?, ?, ?)`,
    [name, email, passwordHash, role]
  );

  const [rows] = await db.execute(
    `SELECT id, name, email, role, created_at
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [result.insertId]
  );
  return rows[0] || null;
}

export async function updateUserPasswordHashById(userId, passwordHash) {
  await pool.execute(
    `UPDATE users
     SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [passwordHash, userId]
  );
}
