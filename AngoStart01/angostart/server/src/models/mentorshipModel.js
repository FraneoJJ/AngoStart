import { pool } from "../config/db.js";

let ensured = false;

export async function ensureMentorshipTable() {
  if (ensured) return;
  await pool.execute(
    `CREATE TABLE IF NOT EXISTS mentorship_requests (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      entrepreneur_user_id BIGINT UNSIGNED NOT NULL,
      mentor_user_id BIGINT UNSIGNED NOT NULL,
      idea_id BIGINT UNSIGNED NULL,
      topic VARCHAR(180) NOT NULL,
      session_type ENUM('online', 'presencial') NOT NULL DEFAULT 'online',
      preferred_datetime DATETIME NOT NULL,
      duration_minutes INT NOT NULL DEFAULT 60,
      payment_method ENUM('multicaixa', 'transferencia', 'unitel-money', 'afrimoney') NOT NULL,
      price_kz DECIMAL(14,2) NOT NULL DEFAULT 0,
      status ENUM('pending', 'accepted', 'rejected', 'completed') NOT NULL DEFAULT 'pending',
      entrepreneur_notes TEXT NULL,
      mentor_notes TEXT NULL,
      mentor_response_at DATETIME NULL,
      scheduled_for DATETIME NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_mr_entrepreneur (entrepreneur_user_id),
      INDEX idx_mr_mentor (mentor_user_id),
      INDEX idx_mr_status (status),
      INDEX idx_mr_datetime (preferred_datetime),
      CONSTRAINT fk_mr_entrepreneur FOREIGN KEY (entrepreneur_user_id) REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_mr_mentor FOREIGN KEY (mentor_user_id) REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_mr_idea FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE SET NULL
    )`
  );
  ensured = true;
}

export async function createMentorshipRequest(input) {
  await ensureMentorshipTable();
  const [result] = await pool.execute(
    `INSERT INTO mentorship_requests (
      entrepreneur_user_id, mentor_user_id, idea_id, topic, session_type, preferred_datetime,
      duration_minutes, payment_method, price_kz, status, entrepreneur_notes, scheduled_for
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
    [
      input.entrepreneurUserId,
      input.mentorUserId,
      input.ideaId || null,
      input.topic,
      input.sessionType,
      input.preferredDatetime,
      input.durationMinutes,
      input.paymentMethod,
      input.priceKz,
      input.entrepreneurNotes || null,
      input.scheduledFor || null,
    ]
  );
  return result.insertId;
}

export async function findMentorshipRequestById(requestId) {
  await ensureMentorshipTable();
  const [rows] = await pool.execute(
    `SELECT id, entrepreneur_user_id, mentor_user_id, idea_id, topic, session_type,
            preferred_datetime, duration_minutes, payment_method, price_kz, status,
            entrepreneur_notes, mentor_notes, mentor_response_at, scheduled_for, created_at, updated_at
     FROM mentorship_requests
     WHERE id = ?
     LIMIT 1`,
    [requestId]
  );
  return rows[0] || null;
}

export async function listMentorshipRequestsForMentor(mentorUserId, status = "") {
  await ensureMentorshipTable();
  const params = [mentorUserId];
  let where = "WHERE mr.mentor_user_id = ?";
  if (status) {
    where += " AND mr.status = ?";
    params.push(status);
  }

  const [rows] = await pool.execute(
    `SELECT
      mr.id, mr.entrepreneur_user_id, mr.mentor_user_id, mr.idea_id, mr.topic, mr.session_type,
      mr.preferred_datetime, mr.duration_minutes, mr.payment_method, mr.price_kz, mr.status,
      mr.entrepreneur_notes, mr.mentor_notes, mr.mentor_response_at, mr.scheduled_for, mr.created_at, mr.updated_at,
      eu.name AS entrepreneur_name, eu.email AS entrepreneur_email,
      mp.business_name AS entrepreneur_business_name, mp.business_sector AS entrepreneur_business_sector,
      m.name AS mentor_name, m.email AS mentor_email,
      i.title AS idea_title
     FROM mentorship_requests mr
     INNER JOIN users eu ON eu.id = mr.entrepreneur_user_id
     INNER JOIN users m ON m.id = mr.mentor_user_id
     LEFT JOIN empreendedor_profiles mp ON mp.user_id = eu.id
     LEFT JOIN ideas i ON i.id = mr.idea_id
     ${where}
     ORDER BY mr.created_at DESC, mr.id DESC`,
    params
  );
  return rows;
}

export async function listMentorshipRequestsByEntrepreneur(entrepreneurUserId) {
  await ensureMentorshipTable();
  const [rows] = await pool.execute(
    `SELECT
      mr.id, mr.entrepreneur_user_id, mr.mentor_user_id, mr.idea_id, mr.topic, mr.session_type,
      mr.preferred_datetime, mr.duration_minutes, mr.payment_method, mr.price_kz, mr.status,
      mr.entrepreneur_notes, mr.mentor_notes, mr.mentor_response_at, mr.scheduled_for, mr.created_at, mr.updated_at,
      me.name AS mentor_name, me.email AS mentor_email,
      i.title AS idea_title
     FROM mentorship_requests mr
     INNER JOIN users me ON me.id = mr.mentor_user_id
     LEFT JOIN ideas i ON i.id = mr.idea_id
     WHERE mr.entrepreneur_user_id = ?
     ORDER BY mr.created_at DESC, mr.id DESC`,
    [entrepreneurUserId]
  );
  return rows;
}

export async function updateMentorshipRequestByMentor(requestId, mentorUserId, input) {
  await ensureMentorshipTable();
  const [result] = await pool.execute(
    `UPDATE mentorship_requests
     SET
       status = ?,
       mentor_notes = ?,
       scheduled_for = ?,
       mentor_response_at = NOW(),
       updated_at = CURRENT_TIMESTAMP
     WHERE id = ? AND mentor_user_id = ?`,
    [
      input.status,
      input.mentorNotes || null,
      input.scheduledFor || null,
      requestId,
      mentorUserId,
    ]
  );
  return result.affectedRows;
}
