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
  } finally {
    conn.release();
  }
}
