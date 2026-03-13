import { pool } from "../config/db.js";

export async function listUsersWithProfiles() {
  const [rows] = await pool.execute(
    `SELECT
      u.id, u.name, u.email, u.role, u.created_at,
      ep.phone AS ep_phone, ep.business_name, ep.business_sector, ep.business_stage, ep.business_location,
      mp.phone AS mp_phone, mp.identity_number AS mp_identity_number, mp.birth_date AS mp_birth_date,
      mp.province AS mp_province, mp.expertise_area, mp.experience_years, mp.company AS mp_company,
      mp.current_role AS mp_current_role, mp.linkedin AS mp_linkedin, mp.bi_front_doc AS mp_bi_front_doc,
      mp.cv_doc AS mp_cv_doc, mp.certificate_doc AS mp_certificate_doc,
      mp.verification_status AS mp_verification_status, mp.verification_id AS mp_verification_id,
      ip.phone AS ip_phone, ip.identity_number AS ip_identity_number, ip.province AS ip_province,
      ip.investor_type, ip.profession, ip.income_source, ip.investment_range, ip.company_name,
      ip.company_nif, ip.company_role, ip.has_investment_experience, ip.investment_experience_area,
      ip.linkedin_or_website, ip.bi_front_doc AS ip_bi_front_doc, ip.company_certificate_doc,
      ip.verification_status AS ip_verification_status, ip.verification_id AS ip_verification_id
    FROM users u
    LEFT JOIN empreendedor_profiles ep ON ep.user_id = u.id
    LEFT JOIN mentor_profiles mp ON mp.user_id = u.id
    LEFT JOIN investidor_profiles ip ON ip.user_id = u.id
    ORDER BY u.created_at DESC, u.id DESC`
  );
  return rows;
}

export async function findUserRoleById(userId) {
  const [rows] = await pool.execute(
    `SELECT id, role FROM users WHERE id = ? LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

export async function updateMentorVerificationStatus(userId, status) {
  await pool.execute(
    `UPDATE mentor_profiles
     SET verification_status = ?, updated_at = CURRENT_TIMESTAMP
     WHERE user_id = ?`,
    [status, userId]
  );
}

export async function updateInvestidorVerificationStatus(userId, status) {
  await pool.execute(
    `UPDATE investidor_profiles
     SET verification_status = ?, updated_at = CURRENT_TIMESTAMP
     WHERE user_id = ?`,
    [status, userId]
  );
}

export async function listInvestorsWithProfiles() {
  const [rows] = await pool.execute(
    `SELECT
      u.id,
      u.name,
      u.email,
      u.created_at,
      ip.phone,
      ip.identity_number,
      ip.province,
      ip.investor_type,
      ip.profession,
      ip.income_source,
      ip.investment_range,
      ip.company_name,
      ip.company_nif,
      ip.company_role,
      ip.has_investment_experience,
      ip.investment_experience_area,
      ip.linkedin_or_website,
      ip.verification_status,
      ip.verification_id
    FROM users u
    INNER JOIN investidor_profiles ip ON ip.user_id = u.id
    ORDER BY u.created_at DESC, u.id DESC`
  );
  return rows;
}

export async function findInvestorByUserId(userId) {
  const [rows] = await pool.execute(
    `SELECT
      u.id,
      u.name,
      u.email,
      u.created_at,
      ip.phone,
      ip.identity_number,
      ip.province,
      ip.investor_type,
      ip.profession,
      ip.income_source,
      ip.investment_range,
      ip.company_name,
      ip.company_nif,
      ip.company_role,
      ip.has_investment_experience,
      ip.investment_experience_area,
      ip.linkedin_or_website,
      ip.verification_status,
      ip.verification_id
    FROM users u
    INNER JOIN investidor_profiles ip ON ip.user_id = u.id
    WHERE u.id = ?
    LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

export async function listAvailableReportMonths() {
  const [rows] = await pool.execute(
    `SELECT DISTINCT month_key
     FROM (
       SELECT DATE_FORMAT(created_at, '%Y-%m') AS month_key FROM users
       UNION ALL
       SELECT DATE_FORMAT(created_at, '%Y-%m') AS month_key FROM ideas
       UNION ALL
       SELECT DATE_FORMAT(created_at, '%Y-%m') AS month_key FROM mentor_profiles
       UNION ALL
       SELECT DATE_FORMAT(created_at, '%Y-%m') AS month_key FROM investidor_profiles
     ) m
     WHERE month_key IS NOT NULL
     ORDER BY month_key DESC`
  );
  return rows.map((r) => r.month_key);
}

export async function getReportSummaryByMonth(startDate, endDate) {
  const [[ideas]] = await pool.execute(
    `SELECT COUNT(*) AS total
     FROM ideas
     WHERE created_at >= ? AND created_at < ?`,
    [startDate, endDate]
  );
  const [[users]] = await pool.execute(
    `SELECT COUNT(*) AS total
     FROM users
     WHERE created_at >= ? AND created_at < ?
       AND role IN ('empreendedor', 'investidor', 'mentor')`,
    [startDate, endDate]
  );
  return {
    ideasInMonth: Number(ideas?.total || 0),
    newSignups: Number(users?.total || 0),
  };
}

export async function getReportRoleDistributionByMonth(startDate, endDate) {
  const [rows] = await pool.execute(
    `SELECT role, COUNT(*) AS total
     FROM users
     WHERE created_at >= ? AND created_at < ?
       AND role IN ('empreendedor', 'investidor', 'mentor')
     GROUP BY role`,
    [startDate, endDate]
  );
  const map = new Map(rows.map((r) => [r.role, Number(r.total || 0)]));
  return {
    empreendedores: map.get("empreendedor") || 0,
    investidores: map.get("investidor") || 0,
    mentores: map.get("mentor") || 0,
  };
}

export async function getReportActivityByMonth(startDate, endDate) {
  const [[mentoringSessions]] = await pool.execute(
    `SELECT COUNT(*) AS total
     FROM mentor_profiles
     WHERE created_at >= ? AND created_at < ?`,
    [startDate, endDate]
  );

  const [[investmentsDone]] = await pool.execute(
    `SELECT COUNT(*) AS total
     FROM investidor_profiles
     WHERE created_at >= ? AND created_at < ?`,
    [startDate, endDate]
  );

  const [[statusCounts]] = await pool.execute(
    `SELECT
      SUM(CASE WHEN verification_status = 'approved' THEN 1 ELSE 0 END) AS approved_count,
      SUM(CASE WHEN verification_status IN ('approved', 'rejected', 'pending') THEN 1 ELSE 0 END) AS total_count
     FROM (
       SELECT verification_status FROM mentor_profiles
       UNION ALL
       SELECT verification_status FROM investidor_profiles
     ) x`
  );

  const approved = Number(statusCounts?.approved_count || 0);
  const total = Number(statusCounts?.total_count || 0);
  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

  return {
    mentoringSessions: Number(mentoringSessions?.total || 0),
    investmentsDone: Number(investmentsDone?.total || 0),
    approvalRate,
  };
}

export async function listAllIdeasForAdmin() {
  const [rows] = await pool.execute(
    `SELECT
      i.id,
      i.title,
      i.description,
      i.sector,
      i.city,
      i.address,
      i.region,
      i.latitude,
      i.longitude,
      i.initial_capital,
      i.problem,
      i.differential_text,
      i.target_audience,
      i.status,
      i.created_by,
      i.created_at,
      i.updated_at,
      u.name AS owner_name,
      u.email AS owner_email,
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
    ORDER BY i.created_at DESC, i.id DESC`
  );
  return rows;
}
