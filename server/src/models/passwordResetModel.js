import { pool } from "../config/db.js";

export async function ensurePasswordResetTable() {
  await pool.execute(
    `CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      user_id BIGINT UNSIGNED NOT NULL,
      token_hash CHAR(64) NOT NULL,
      expires_at DATETIME NOT NULL,
      used_at DATETIME NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_password_reset_token_hash (token_hash),
      INDEX idx_password_reset_user (user_id),
      INDEX idx_password_reset_expires (expires_at),
      CONSTRAINT fk_password_reset_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`
  );
}

export async function invalidateActiveTokensByUserId(userId) {
  await pool.execute(
    `UPDATE password_reset_tokens
     SET used_at = NOW()
     WHERE user_id = ? AND used_at IS NULL AND expires_at > NOW()`,
    [userId]
  );
}

export async function createPasswordResetToken({ userId, tokenHash, expiresAt }) {
  const [result] = await pool.execute(
    `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
     VALUES (?, ?, ?)`,
    [userId, tokenHash, expiresAt]
  );
  return result.insertId;
}

export async function findValidPasswordResetTokenByHash(tokenHash) {
  const [rows] = await pool.execute(
    `SELECT id, user_id, token_hash, expires_at, used_at, created_at
     FROM password_reset_tokens
     WHERE token_hash = ?
       AND used_at IS NULL
       AND expires_at > NOW()
     LIMIT 1`,
    [tokenHash]
  );
  return rows[0] || null;
}

export async function markPasswordResetTokenAsUsed(tokenId) {
  await pool.execute(
    `UPDATE password_reset_tokens
     SET used_at = NOW()
     WHERE id = ?`,
    [tokenId]
  );
}
