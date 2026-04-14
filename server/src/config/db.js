import mysql from "mysql2/promise";
import { env } from "./env.js";

export const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function initDb() {
  const conn = await pool.getConnection();
  try {
    await conn.ping();
    const [[tableCheck]] = await conn.execute(
      `SELECT COUNT(*) AS total
       FROM INFORMATION_SCHEMA.TABLES
       WHERE TABLE_SCHEMA = ?
         AND TABLE_NAME = 'empreendedor_profiles'`,
      [env.DB_NAME]
    );
    if (!Number(tableCheck?.total || 0)) return;

    const [rows] = await conn.execute(
      `SELECT COLUMN_NAME
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = ?
         AND TABLE_NAME = 'empreendedor_profiles'
         AND COLUMN_NAME IN ('verification_id', 'verification_status')`,
      [env.DB_NAME]
    );
    const cols = new Set((rows || []).map((r) => String(r.COLUMN_NAME || "").toLowerCase()));
    if (!cols.has("verification_id")) {
      await conn.execute(
        `ALTER TABLE empreendedor_profiles
         ADD COLUMN verification_id VARCHAR(40) NOT NULL DEFAULT 'VER-E-LEGACY'`
      );
    }
    if (!cols.has("verification_status")) {
      await conn.execute(
        `ALTER TABLE empreendedor_profiles
         ADD COLUMN verification_status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending'`
      );
    }

    const [userAvatarColRows] = await conn.execute(
      `SELECT COLUMN_NAME
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = ?
         AND TABLE_NAME = 'users'
         AND COLUMN_NAME = 'avatar_url'`,
      [env.DB_NAME]
    );
    if (!Array.isArray(userAvatarColRows) || userAvatarColRows.length === 0) {
      await conn.execute(
        `ALTER TABLE users
         ADD COLUMN avatar_url LONGTEXT NULL`
      );
    }

    const [ideaApprovalColRows] = await conn.execute(
      `SELECT COLUMN_NAME
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = ?
         AND TABLE_NAME = 'ideas'
         AND COLUMN_NAME = 'approval_status'`,
      [env.DB_NAME]
    );
    if (!Array.isArray(ideaApprovalColRows) || ideaApprovalColRows.length === 0) {
      await conn.execute(
        `ALTER TABLE ideas
         ADD COLUMN approval_status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending'`
      );
    }

    await conn.execute(
      `CREATE TABLE IF NOT EXISTS idea_progress (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT UNSIGNED NOT NULL,
        idea_id BIGINT UNSIGNED NOT NULL,
        status ENUM('inicial', 'validacao', 'crescimento', 'escala') NOT NULL DEFAULT 'inicial',
        progress_percentage DECIMAL(5, 2) NOT NULL DEFAULT 0,
        goals_completed TEXT NULL,
        next_steps TEXT NULL,
        revenue DECIMAL(14, 2) NOT NULL DEFAULT 0,
        expenses DECIMAL(14, 2) NOT NULL DEFAULT 0,
        investment DECIMAL(14, 2) NOT NULL DEFAULT 0,
        total_clients INT NOT NULL DEFAULT 0,
        new_clients INT NOT NULL DEFAULT 0,
        lost_clients INT NOT NULL DEFAULT 0,
        customer_feedback TEXT NULL,
        marketing_campaigns TEXT NULL,
        marketing_channels TEXT NULL,
        marketing_results TEXT NULL,
        weekly_summary TEXT NULL,
        challenges TEXT NULL,
        learnings TEXT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_idea_progress_user (user_id),
        INDEX idx_idea_progress_idea (idea_id),
        INDEX idx_idea_progress_created_at (created_at),
        CONSTRAINT fk_idea_progress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_idea_progress_idea FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE
      )`
    );
  } finally {
    conn.release();
  }
}
