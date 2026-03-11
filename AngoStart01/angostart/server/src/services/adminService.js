import { z } from "zod";
import {
  findInvestorByUserId,
  findUserRoleById,
  listInvestorsWithProfiles,
  listUsersWithProfiles,
  updateInvestidorVerificationStatus,
  updateMentorVerificationStatus,
} from "../models/adminModel.js";

const verificationSchema = z.object({
  status: z.enum(["approved", "rejected"]),
});

function normalizeUser(row) {
  let verificationStatus = "approved";
  let verificationId = null;
  let profile = {};

  if (row.role === "empreendedor") {
    profile = {
      phone: row.ep_phone || null,
      businessName: row.business_name || null,
      businessSector: row.business_sector || null,
      businessStage: row.business_stage || null,
      businessLocation: row.business_location || null,
    };
  } else if (row.role === "mentor") {
    verificationStatus = row.mp_verification_status || "pending";
    verificationId = row.mp_verification_id || null;
    profile = {
      phone: row.mp_phone || null,
      identityNumber: row.mp_identity_number || null,
      birthDate: row.mp_birth_date || null,
      province: row.mp_province || null,
      expertiseArea: row.expertise_area || null,
      experienceYears: row.experience_years || null,
      company: row.mp_company || null,
      currentRole: row.mp_current_role || null,
      linkedin: row.mp_linkedin || null,
      biFrontDoc: row.mp_bi_front_doc || null,
      cvDoc: row.mp_cv_doc || null,
      certificateDoc: row.mp_certificate_doc || null,
    };
  } else if (row.role === "investidor") {
    verificationStatus = row.ip_verification_status || "pending";
    verificationId = row.ip_verification_id || null;
    profile = {
      phone: row.ip_phone || null,
      identityNumber: row.ip_identity_number || null,
      province: row.ip_province || null,
      investorType: row.investor_type || null,
      profession: row.profession || null,
      incomeSource: row.income_source || null,
      investmentRange: row.investment_range || null,
      companyName: row.company_name || null,
      companyNif: row.company_nif || null,
      companyRole: row.company_role || null,
      hasInvestmentExperience: row.has_investment_experience || null,
      investmentExperienceArea: row.investment_experience_area || null,
      linkedinOrWebsite: row.linkedin_or_website || null,
      biFrontDoc: row.ip_bi_front_doc || null,
      companyCertificateDoc: row.company_certificate_doc || null,
    };
  }

  return {
    id: Number(row.id),
    name: row.name,
    email: row.email,
    role: row.role,
    createdAt: row.created_at,
    verificationStatus,
    verificationId,
    profile,
  };
}

export async function listAdminUsers() {
  const rows = await listUsersWithProfiles();
  return rows.map(normalizeUser);
}

export async function setUserVerification(userId, payload) {
  const targetUserId = Number(userId);
  if (!Number.isInteger(targetUserId) || targetUserId <= 0) {
    throw { status: 400, message: "ID de utilizador inválido." };
  }
  const { status } = verificationSchema.parse(payload || {});

  const user = await findUserRoleById(targetUserId);
  if (!user) throw { status: 404, message: "Utilizador não encontrado." };
  if (user.role === "admin" || user.role === "empreendedor") {
    throw { status: 400, message: "Este tipo de conta não requer aprovação/rejeição manual." };
  }

  if (user.role === "mentor") {
    await updateMentorVerificationStatus(targetUserId, status);
  } else if (user.role === "investidor") {
    await updateInvestidorVerificationStatus(targetUserId, status);
  }

  const users = await listUsersWithProfiles();
  const updated = users.find((row) => Number(row.id) === targetUserId);
  return updated ? normalizeUser(updated) : null;
}

function normalizeInvestor(row) {
  return {
    id: Number(row.id),
    name: row.name,
    email: row.email,
    role: "investidor",
    createdAt: row.created_at,
    verificationStatus: row.verification_status || "pending",
    verificationId: row.verification_id || null,
    profile: {
      phone: row.phone || null,
      identityNumber: row.identity_number || null,
      province: row.province || null,
      investorType: row.investor_type || null,
      profession: row.profession || null,
      incomeSource: row.income_source || null,
      investmentRange: row.investment_range || null,
      companyName: row.company_name || null,
      companyNif: row.company_nif || null,
      companyRole: row.company_role || null,
      hasInvestmentExperience: row.has_investment_experience || null,
      investmentExperienceArea: row.investment_experience_area || null,
      linkedinOrWebsite: row.linkedin_or_website || null,
    },
  };
}

export async function listInvestorsForEntrepreneur() {
  const rows = await listInvestorsWithProfiles();
  return rows.map(normalizeInvestor);
}

export async function getInvestorDetailsForEntrepreneur(investorUserId) {
  const targetId = Number(investorUserId);
  if (!Number.isInteger(targetId) || targetId <= 0) {
    throw { status: 400, message: "ID de investidor inválido." };
  }

  const row = await findInvestorByUserId(targetId);
  if (!row) {
    throw { status: 404, message: "Investidor não encontrado." };
  }
  return normalizeInvestor(row);
}
