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
