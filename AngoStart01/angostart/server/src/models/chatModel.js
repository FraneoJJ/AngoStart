import { pool } from "../config/db.js";

let ensured = false;

export async function ensureChatTables() {
  if (ensured) return;
  await pool.execute(
    `CREATE TABLE IF NOT EXISTS mensagens (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      sender_id BIGINT UNSIGNED NOT NULL,
      receiver_id BIGINT UNSIGNED NOT NULL,
      message TEXT NOT NULL,
      timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      lida TINYINT(1) NOT NULL DEFAULT 0,
      INDEX idx_msg_sender (sender_id),
      INDEX idx_msg_receiver (receiver_id),
      INDEX idx_msg_time (timestamp),
      CONSTRAINT fk_msg_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_msg_receiver FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
    )`
  );
  ensured = true;
}

export async function insertMessage({ senderId, receiverId, message }) {
  await ensureChatTables();
  const [result] = await pool.execute(
    `INSERT INTO mensagens (sender_id, receiver_id, message, timestamp, lida)
     VALUES (?, ?, ?, NOW(), 0)`,
    [senderId, receiverId, message]
  );
  return result.insertId;
}

export async function findMessageById(id) {
  await ensureChatTables();
  const [rows] = await pool.execute(
    `SELECT m.id, m.sender_id, m.receiver_id, m.message, m.timestamp, m.lida
     FROM mensagens m
     WHERE m.id = ?
     LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

export async function listMessagesBetweenUsers(userA, userB, limit = 100) {
  await ensureChatTables();
  const [rows] = await pool.execute(
    `SELECT m.id, m.sender_id, m.receiver_id, m.message, m.timestamp, m.lida
     FROM mensagens m
     WHERE (m.sender_id = ? AND m.receiver_id = ?)
        OR (m.sender_id = ? AND m.receiver_id = ?)
     ORDER BY m.timestamp ASC, m.id ASC
     LIMIT ?`,
    [userA, userB, userB, userA, Number(limit)]
  );
  return rows;
}

export async function listConversationUsersForUser(userId) {
  await ensureChatTables();
  const [rows] = await pool.execute(
    `SELECT
      u.id,
      u.name,
      u.email,
      u.role,
      x.last_message,
      x.last_message_at
     FROM (
       SELECT
         CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END AS other_user_id,
         MAX(m.id) AS last_message_id
       FROM mensagens m
       WHERE m.sender_id = ? OR m.receiver_id = ?
       GROUP BY other_user_id
     ) c
     INNER JOIN mensagens xmsg ON xmsg.id = c.last_message_id
     INNER JOIN users u ON u.id = c.other_user_id
     INNER JOIN (
       SELECT
         m.id,
         m.message AS last_message,
         m.timestamp AS last_message_at
       FROM mensagens m
     ) x ON x.id = xmsg.id
     ORDER BY x.last_message_at DESC, u.id DESC`,
    [userId, userId, userId]
  );
  return rows;
}

export async function markMessagesAsRead(receiverId, senderId) {
  await ensureChatTables();
  const [result] = await pool.execute(
    `UPDATE mensagens
     SET lida = 1
     WHERE receiver_id = ? AND sender_id = ? AND lida = 0`,
    [receiverId, senderId]
  );
  return result.affectedRows;
}
