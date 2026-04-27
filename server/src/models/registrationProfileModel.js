import { pool } from "../config/db.js";

export async function createEmpreendedorProfile(db, input) {
  const [result] = await db.execute(
    `INSERT INTO empreendedor_profiles
      (
        user_id, phone, has_business, business_name, business_sector, business_stage, business_location,
        accept_terms, verification_id, verification_status
      )
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [
      input.userId,
      input.phone,
      input.hasBusiness ? 1 : 0,
      input.businessName,
      input.businessSector,
      input.businessStage,
      input.businessLocation || null,
      input.acceptTerms ? 1 : 0,
      input.verificationId,
    ]
  );
  return result.insertId;
}

export async function findEmpreendedorProfileByUserId(userId) {
  const [rows] = await pool.execute(
    `SELECT user_id FROM empreendedor_profiles WHERE user_id = ? LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

export async function createMentorProfile(db, input) {
  const [result] = await db.execute(
    `INSERT INTO mentor_profiles
      (
        user_id, phone, identity_number, birth_date, province, expertise_area,
        experience_years, company, current_role, linkedin, bi_front_doc, cv_doc,
        certificate_doc, declare_truth, accept_terms, verification_id, verification_status
      )
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [
      input.userId,
      input.phone,
      input.identityNumber,
      input.birthDate,
      input.province,
      input.expertiseArea,
      input.experienceYears,
      input.company,
      input.currentRole,
      input.linkedin || null,
      input.biFrontDoc,
      input.cvDoc || null,
      input.certificateDoc || null,
      input.declareTruth ? 1 : 0,
      input.acceptTerms ? 1 : 0,
      input.verificationId,
    ]
  );
  return result.insertId;
}

export async function findMentorProfileByUserId(userId) {
  const [rows] = await pool.execute(
    `SELECT user_id FROM mentor_profiles WHERE user_id = ? LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

export async function createInvestidorProfile(db, input) {
  const [result] = await db.execute(
    `INSERT INTO investidor_profiles
      (
        user_id, phone, identity_number, province, investor_type, profession,
        income_source, investment_range, company_name, company_nif, company_role,
        has_investment_experience, investment_experience_area, linkedin_or_website,
        bi_front_doc, company_certificate_doc, declare_truth, accept_terms,
        verification_id, verification_status
      )
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [
      input.userId,
      input.phone,
      input.identityNumber,
      input.province,
      input.investorType,
      input.profession || null,
      input.incomeSource || null,
      input.investmentRange || null,
      input.companyName || null,
      input.companyNif || null,
      input.companyRole || null,
      input.hasInvestmentExperience || null,
      input.investmentExperienceArea || null,
      input.linkedinOrWebsite || null,
      input.biFrontDoc,
      input.companyCertificateDoc || null,
      input.declareTruth ? 1 : 0,
      input.acceptTerms ? 1 : 0,
      input.verificationId,
    ]
  );
  return result.insertId;
}

export async function findInvestidorProfileByUserId(userId) {
  const [rows] = await pool.execute(
    `SELECT user_id FROM investidor_profiles WHERE user_id = ? LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

export async function updateEmpreendedorProfileByUserId(userId, input) {
  const [existingRows] = await pool.execute(
    `SELECT has_business
     FROM empreendedor_profiles
     WHERE user_id = ?
     LIMIT 1`,
    [userId]
  );
  const existingHasBusiness = Number(existingRows?.[0]?.has_business || 0) === 1;
  const hasBusiness = typeof input.hasBusiness === "boolean" ? input.hasBusiness : existingHasBusiness;
  const [result] = await pool.execute(
    `UPDATE empreendedor_profiles
     SET
       phone = ?,
       has_business = ?,
       business_name = ?,
       business_sector = ?,
       business_stage = ?,
       business_location = ?,
      verification_status = 'pending',
       updated_at = CURRENT_TIMESTAMP
     WHERE user_id = ?`,
    [
      input.phone || null,
      hasBusiness ? 1 : 0,
      hasBusiness ? (input.businessName || null) : null,
      hasBusiness ? (input.businessSector || null) : null,
      hasBusiness ? (input.businessStage || null) : null,
      input.businessLocation || null,
      userId,
    ]
  );
  return result.affectedRows;
}

export async function updateMentorProfileByUserId(userId, input) {
  const [result] = await pool.execute(
    `UPDATE mentor_profiles
     SET
       phone = ?,
       province = ?,
       expertise_area = ?,
       experience_years = ?,
       company = ?,
       current_role = ?,
       linkedin = ?,
       verification_status = 'pending',
       updated_at = CURRENT_TIMESTAMP
     WHERE user_id = ?`,
    [
      input.phone || null,
      input.province || null,
      input.expertiseArea || null,
      input.experienceYears != null ? Number(input.experienceYears) : null,
      input.company || null,
      input.currentRole || null,
      input.linkedin || null,
      userId,
    ]
  );
  return result.affectedRows;
}

export async function updateInvestidorProfileByUserId(userId, input) {
  const [result] = await pool.execute(
    `UPDATE investidor_profiles
     SET
       phone = ?,
       province = ?,
       investor_type = ?,
       profession = ?,
       income_source = ?,
       investment_range = ?,
       company_name = ?,
       company_nif = ?,
       company_role = ?,
       has_investment_experience = ?,
       investment_experience_area = ?,
       linkedin_or_website = ?,
       verification_status = 'pending',
       updated_at = CURRENT_TIMESTAMP
     WHERE user_id = ?`,
    [
      input.phone || null,
      input.province || null,
      input.investorType || null,
      input.profession || null,
      input.incomeSource || null,
      input.investmentRange || null,
      input.companyName || null,
      input.companyNif || null,
      input.companyRole || null,
      input.hasInvestmentExperience || null,
      input.investmentExperienceArea || null,
      input.linkedinOrWebsite || null,
      userId,
    ]
  );
  return result.affectedRows;
}

export async function findVerificationByUserRole(userId, role) {
  if (role === "empreendedor") {
    const [rows] = await dbQuery(
      `SELECT verification_status, verification_id
       FROM empreendedor_profiles
       WHERE user_id = ?
       LIMIT 1`,
      [userId]
    );
    return rows[0] || null;
  }

  if (role === "mentor") {
    const [rows] = await dbQuery(
      `SELECT verification_status, verification_id
       FROM mentor_profiles
       WHERE user_id = ?
       LIMIT 1`,
      [userId]
    );
    return rows[0] || null;
  }

  if (role === "investidor") {
    const [rows] = await dbQuery(
      `SELECT verification_status, verification_id
       FROM investidor_profiles
       WHERE user_id = ?
       LIMIT 1`,
      [userId]
    );
    return rows[0] || null;
  }

  return { verification_status: "approved", verification_id: null };
}

export async function findProfileDataByUserRole(userId, role) {
  if (role === "empreendedor") {
    const [rows] = await dbQuery(
      `SELECT
        phone,
        has_business,
        business_name,
        business_sector,
        business_stage,
        business_location,
        verification_status
       FROM empreendedor_profiles
       WHERE user_id = ?
       LIMIT 1`,
      [userId]
    );
    return rows[0] || null;
  }

  if (role === "mentor") {
    const [rows] = await dbQuery(
      `SELECT
        phone,
        identity_number,
        birth_date,
        province,
        expertise_area,
        experience_years,
        company,
        current_role,
        linkedin,
        verification_status
       FROM mentor_profiles
       WHERE user_id = ?
       LIMIT 1`,
      [userId]
    );
    return rows[0] || null;
  }

  if (role === "investidor") {
    const [rows] = await dbQuery(
      `SELECT
        phone,
        identity_number,
        province,
        investor_type,
        profession,
        income_source,
        investment_range,
        company_name,
        company_nif,
        company_role,
        has_investment_experience,
        investment_experience_area,
        linkedin_or_website,
        verification_status
       FROM investidor_profiles
       WHERE user_id = ?
       LIMIT 1`,
      [userId]
    );
    return rows[0] || null;
  }

  return null;
}

function dbQuery(sql, params) {
  return pool.execute(sql, params);
}
