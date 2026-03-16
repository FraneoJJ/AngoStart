import { pool } from "../config/db.js";

let ensured = false;

export async function ensureCallTable() {
  if (ensured) return;
  await pool.execute(
    `CREATE TABLE IF NOT EXISTS call_sessions (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      channel_name VARCHAR(200) NOT NULL UNIQUE,
      caller_id BIGINT UNSIGNED NOT NULL,
      receiver_id BIGINT UNSIGNED NOT NULL,
      call_type ENUM('video', 'voice') NOT NULL DEFAULT 'video',
      status ENUM('invited', 'accepted', 'rejected', 'ended', 'missed') NOT NULL DEFAULT 'invited',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      accepted_at DATETIME NULL,
      ended_at DATETIME NULL,
      ended_by_user_id BIGINT UNSIGNED NULL,
      INDEX idx_call_channel (channel_name),
      INDEX idx_call_caller (caller_id),
      INDEX idx_call_receiver (receiver_id),
      INDEX idx_call_status (status),
      CONSTRAINT fk_call_caller FOREIGN KEY (caller_id) REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_call_receiver FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_call_ended_by FOREIGN KEY (ended_by_user_id) REFERENCES users(id) ON DELETE SET NULL
    )`
  );
  ensured = true;
}

export async function insertCallSession({ channelName, callerId, receiverId, callType }) {
  await ensureCallTable();
  await pool.execute(
    `INSERT INTO call_sessions (channel_name, caller_id, receiver_id, call_type, status)
     VALUES (?, ?, ?, ?, 'invited')
     ON DUPLICATE KEY UPDATE
       caller_id = VALUES(caller_id),
       receiver_id = VALUES(receiver_id),
       call_type = VALUES(call_type),
       status = 'invited',
       accepted_at = NULL,
       ended_at = NULL,
       ended_by_user_id = NULL`,
    [channelName, callerId, receiverId, callType]
  );
}

export async function updateCallStatus({ channelName, status, endedByUserId = null }) {
  await ensureCallTable();
  if (status === "accepted") {
    await pool.execute(
      `UPDATE call_sessions
       SET status = 'accepted', accepted_at = NOW()
       WHERE channel_name = ?`,
      [channelName]
    );
    return;
  }
  if (status === "rejected") {
    await pool.execute(
      `UPDATE call_sessions
       SET status = 'rejected', ended_at = NOW(), ended_by_user_id = ?
       WHERE channel_name = ?`,
      [endedByUserId || null, channelName]
    );
    return;
  }
  if (status === "ended") {
    await pool.execute(
      `UPDATE call_sessions
       SET status = 'ended', ended_at = NOW(), ended_by_user_id = ?
       WHERE channel_name = ?`,
      [endedByUserId || null, channelName]
    );
  }
}

export async function listCallsBetweenUsers(userA, userB, limit = 30) {
  await ensureCallTable();
  const [rows] = await pool.execute(
    `SELECT id, channel_name, caller_id, receiver_id, call_type, status, created_at, accepted_at, ended_at, ended_by_user_id
     FROM call_sessions
     WHERE (caller_id = ? AND receiver_id = ?)
        OR (caller_id = ? AND receiver_id = ?)
     ORDER BY created_at DESC, id DESC
     LIMIT ?`,
    [userA, userB, userB, userA, Number(limit)]
  );
  return rows;
}
