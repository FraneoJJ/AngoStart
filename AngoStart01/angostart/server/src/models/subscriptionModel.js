import { pool } from "../config/db.js";

export async function findSubscriptionByUserId(userId) {
  const [rows] = await pool.execute(
    `SELECT id, user_id, plan_code, billing_cycle, status, started_at, expires_at, updated_at
     FROM user_subscriptions
     WHERE user_id = ?
     LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

export async function upsertSubscriptionByUserId({
  userId,
  planCode,
  billingCycle,
  status,
  expiresAt,
}) {
  await pool.execute(
    `INSERT INTO user_subscriptions
      (user_id, plan_code, billing_cycle, status, started_at, expires_at)
     VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
     ON DUPLICATE KEY UPDATE
      plan_code = VALUES(plan_code),
      billing_cycle = VALUES(billing_cycle),
      status = VALUES(status),
      expires_at = VALUES(expires_at),
      updated_at = CURRENT_TIMESTAMP`,
    [userId, planCode, billingCycle, status, expiresAt || null]
  );

  return findSubscriptionByUserId(userId);
}
