import { z } from "zod";
import {
  findMentorByUserId,
  findInvestorByUserId,
  findUserRoleById,
  getReportActivityByMonth,
  getReportRoleDistributionByMonth,
  getReportSummaryByMonth,
  listAllIdeasForAdmin,
  listInvestorsWithProfiles,
  listMentorsWithProfiles,
  listAvailableReportMonths,
  listUsersWithProfiles,
  updateEmpreendedorVerificationStatus,
  updateInvestidorVerificationStatus,
  updateMentorVerificationStatus,
} from "../models/adminModel.js";

const verificationSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  role: z.enum(["empreendedor", "mentor", "investidor"]).optional(),
});

function normalizeUserByRole(row, role) {
  let verificationStatus = "approved";
  let verificationId = null;
  let profile = {};

  if (role === "empreendedor") {
    verificationStatus = row.ep_verification_status || "pending";
    verificationId = row.ep_verification_id || null;
    profile = {
      phone: row.ep_phone || null,
      businessName: row.business_name || null,
      businessSector: row.business_sector || null,
      businessStage: row.business_stage || null,
      businessLocation: row.business_location || null,
    };
  } else if (role === "mentor") {
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
  } else if (role === "investidor") {
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
    rowKey: `${Number(row.id)}:${role}`,
    name: row.name,
    email: row.email,
    role,
    profileExists: true,
    createdAt: row.created_at,
    verificationStatus,
    verificationId,
    profile,
  };
}

export async function listAdminUsers() {
  const rows = await listUsersWithProfiles();
  const out = [];
  for (const row of rows) {
    const uid = Number(row.id);
    const hasEmpreendedor = row.ep_user_id != null;
    const hasMentor = row.mp_user_id != null;
    const hasInvestidor = row.ip_user_id != null;

    if (hasEmpreendedor) out.push(normalizeUserByRole(row, "empreendedor"));
    if (hasMentor) out.push(normalizeUserByRole(row, "mentor"));
    if (hasInvestidor) out.push(normalizeUserByRole(row, "investidor"));
    if (!hasEmpreendedor && !hasMentor && !hasInvestidor) {
      out.push({
        id: uid,
        rowKey: `${uid}:admin`,
        name: row.name,
        email: row.email,
        role: row.role,
        profileExists: false,
        createdAt: row.created_at,
        verificationStatus: "approved",
        verificationId: null,
        profile: {},
      });
    }
  }
  return out;
}

export async function setUserVerification(userId, payload) {
  const targetUserId = Number(userId);
  if (!Number.isInteger(targetUserId) || targetUserId <= 0) {
    throw { status: 400, message: "ID de utilizador inválido." };
  }
  const { status, role } = verificationSchema.parse(payload || {});

  const user = await findUserRoleById(targetUserId);
  if (!user) throw { status: 404, message: "Utilizador não encontrado." };
  const targetRole = role || user.role;
  if (targetRole === "admin") {
    throw { status: 400, message: "Este tipo de conta não requer aprovação/rejeição manual." };
  }

  let affected = 0;
  if (targetRole === "empreendedor") {
    affected = await updateEmpreendedorVerificationStatus(targetUserId, status);
  } else if (targetRole === "mentor") {
    affected = await updateMentorVerificationStatus(targetUserId, status);
  } else if (targetRole === "investidor") {
    affected = await updateInvestidorVerificationStatus(targetUserId, status);
  }

  if (!affected) {
    const users = await listAdminUsers();
    const candidate = users.find((u) => Number(u.id) === targetUserId && u.profileExists);
    if (!candidate) {
      throw { status: 404, message: "Este utilizador não possui perfil verificável para aprovação/rejeição." };
    }
    throw { status: 404, message: "Perfil do papel selecionado não encontrado para este utilizador. Atualize a lista e tente novamente." };
  }

  const users = await listAdminUsers();
  const updated = users.find((u) => Number(u.id) === targetUserId && u.role === targetRole);
  return updated || null;
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

function normalizeMentor(row) {
  return {
    id: Number(row.id),
    name: row.name,
    email: row.email,
    role: "mentor",
    createdAt: row.created_at,
    verificationStatus: row.verification_status || "pending",
    verificationId: row.verification_id || null,
    profile: {
      phone: row.phone || null,
      identityNumber: row.identity_number || null,
      birthDate: row.birth_date || null,
      province: row.province || null,
      expertiseArea: row.expertise_area || null,
      experienceYears: row.experience_years || null,
      company: row.company || null,
      currentRole: row.current_role || null,
      linkedin: row.linkedin || null,
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

export async function listMentorsForEntrepreneur() {
  const rows = await listMentorsWithProfiles();
  return rows
    .map(normalizeMentor)
    .filter((mentor) => mentor.verificationStatus === "approved");
}

export async function getMentorDetailsForEntrepreneur(mentorUserId) {
  const targetId = Number(mentorUserId);
  if (!Number.isInteger(targetId) || targetId <= 0) {
    throw { status: 400, message: "ID de mentor inválido." };
  }

  const row = await findMentorByUserId(targetId);
  if (!row) {
    throw { status: 404, message: "Mentor não encontrado." };
  }
  const mentor = normalizeMentor(row);
  if (mentor.verificationStatus !== "approved") {
    throw { status: 403, message: "Este mentor ainda não está verificado." };
  }
  return mentor;
}

function monthLabel(monthKey) {
  const [year, month] = String(monthKey || "").split("-");
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];
  const monthIdx = Number(month) - 1;
  if (!year || Number.isNaN(monthIdx) || monthIdx < 0 || monthIdx > 11) return monthKey;
  return `${months[monthIdx]} ${year}`;
}

function monthRange(monthKey) {
  const [yearRaw, monthRaw] = String(monthKey || "").split("-");
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  if (!year || !month || month < 1 || month > 12) return null;
  const startDate = `${yearRaw}-${String(month).padStart(2, "0")}-01 00:00:00`;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const endDate = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01 00:00:00`;
  return { startDate, endDate };
}

export async function getPerformanceReport(selectedMonth = "") {
  const months = await listAvailableReportMonths();
  const fallbackMonth = months[0] || new Date().toISOString().slice(0, 7);
  const referenceMonth = selectedMonth && months.includes(selectedMonth) ? selectedMonth : fallbackMonth;
  const monthOptions = months.length > 0 ? months : [referenceMonth];
  const range = monthRange(referenceMonth);
  if (!range) {
    throw { status: 400, message: "Mês de referência inválido." };
  }

  const [summary, distribution, activity] = await Promise.all([
    getReportSummaryByMonth(range.startDate, range.endDate),
    getReportRoleDistributionByMonth(range.startDate, range.endDate),
    getReportActivityByMonth(range.startDate, range.endDate),
  ]);

  return {
    referenceMonth,
    referenceLabel: monthLabel(referenceMonth),
    availableMonths: monthOptions.map((m) => ({ value: m, label: monthLabel(m) })),
    summary,
    distribution,
    activity,
    collectedAt: new Date().toISOString(),
  };
}

export async function listAdminIdeas() {
  return listAllIdeasForAdmin();
}
