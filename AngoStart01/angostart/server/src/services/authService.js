import bcrypt from "bcryptjs";
import { z } from "zod";
import { pool } from "../config/db.js";
import {
  createUser,
  findUserByEmail,
  findUserPublicById,
  USER_ROLES,
} from "../models/userModel.js";
import {
  createEmpreendedorProfile,
  createInvestidorProfile,
  createMentorProfile,
  findEmpreendedorProfileByUserId,
  findInvestidorProfileByUserId,
  findMentorProfileByUserId,
  findProfileDataByUserRole,
  findVerificationByUserRole,
  updateEmpreendedorProfileByUserId,
  updateInvestidorProfileByUserId,
  updateMentorProfileByUserId,
} from "../models/registrationProfileModel.js";
import { signAccessToken } from "../utils/jwt.js";

const profileSchema = z.object({
  phone: z.string().min(6).max(30).optional(),
  businessName: z.string().max(180).optional(),
  businessSector: z.string().max(120).optional(),
  businessStage: z.string().max(120).optional(),
  businessLocation: z.string().max(120).optional(),
  identityNumber: z.string().max(30).optional(),
  birthDate: z.string().optional(),
  province: z.string().max(120).optional(),
  expertiseArea: z.string().max(120).optional(),
  experienceYears: z.coerce.number().int().optional(),
  company: z.string().max(180).optional(),
  currentRole: z.string().max(180).optional(),
  linkedin: z.string().max(255).optional().or(z.literal("")),
  investorType: z.enum(["individual", "empresa"]).optional().or(z.literal("")),
  profession: z.string().max(180).optional(),
  incomeSource: z.string().max(180).optional(),
  investmentRange: z.string().max(120).optional(),
  companyName: z.string().max(180).optional(),
  companyNif: z.string().max(40).optional(),
  companyRole: z.string().max(180).optional(),
  hasInvestmentExperience: z.enum(["sim", "nao"]).optional().or(z.literal("")),
  investmentExperienceArea: z.string().max(180).optional(),
  linkedinOrWebsite: z.string().max(255).optional().or(z.literal("")),
  biFrontDoc: z.string().max(255).optional(),
  cvDoc: z.string().max(255).optional(),
  certificateDoc: z.string().max(255).optional(),
  companyCertificateDoc: z.string().max(255).optional(),
  acceptTerms: z.coerce.boolean().optional(),
  declareTruth: z.coerce.boolean().optional(),
});

const registerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(6).max(120),
  role: z.enum(USER_ROLES).default("empreendedor"),
  profileData: profileSchema.optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(120),
  role: z.enum(USER_ROLES).optional(),
});

const switchRoleSchema = z.object({
  role: z.enum(USER_ROLES),
});

const updateProfileSchema = z.object({
  profileData: profileSchema,
});

async function listAvailableRoles(user) {
  if (!user) return [];
  const userId = Number(user.id);
  const roles = new Set([user.role]);
  if (await findEmpreendedorProfileByUserId(userId)) roles.add("empreendedor");
  if (await findMentorProfileByUserId(userId)) roles.add("mentor");
  if (await findInvestidorProfileByUserId(userId)) roles.add("investidor");
  return Array.from(roles);
}

async function enrichUserWithVerification(user, activeRole = null) {
  if (!user) return user;
  const selectedRole = activeRole || user.role;
  const verification = await findVerificationByUserRole(Number(user.id), selectedRole);
  const profileData = await findProfileDataByUserRole(Number(user.id), selectedRole);
  const availableRoles = await listAvailableRoles(user);
  return {
    ...user,
    primaryRole: user.role,
    role: selectedRole,
    availableRoles,
    verificationStatus: verification?.verification_status || "approved",
    verificationId: verification?.verification_id || null,
    profileData: profileData || {},
  };
}

export async function register(input) {
  const data = registerSchema.parse(input);
  const existing = await findUserByEmail(data.email);
  const profile = data.profileData || {};
  const passwordHash = await bcrypt.hash(data.password, 10);
  const db = await pool.getConnection();
  let user = null;
  let verification = null;
  try {
    await db.beginTransaction();

    if (!existing) {
      user = await createUser(
        {
          name: data.name,
          email: data.email,
          passwordHash,
          role: data.role,
        },
        db
      );
      if (!user) throw { status: 500, message: "Falha ao criar utilizador." };
    } else {
      const passwordOk = await bcrypt.compare(data.password, existing.password_hash);
      if (!passwordOk) {
        throw { status: 409, message: "Email já cadastrado. Use a senha da conta existente para adicionar novo perfil." };
      }
      user = await findUserPublicById(existing.id);
      if (!user) throw { status: 500, message: "Utilizador existente não encontrado." };
    }

    if (data.role === "empreendedor") {
      if (!profile.phone || !profile.businessName || !profile.businessSector || !profile.businessStage) {
        throw { status: 400, message: "Dados do negócio incompletos para empreendedor." };
      }
      const exists = await findEmpreendedorProfileByUserId(user.id);
      if (exists) throw { status: 409, message: "Este utilizador já possui perfil de empreendedor." };
      await createEmpreendedorProfile(db, {
        userId: user.id,
        phone: profile.phone,
        businessName: profile.businessName,
        businessSector: profile.businessSector,
        businessStage: profile.businessStage,
        businessLocation: profile.businessLocation || null,
        acceptTerms: !!profile.acceptTerms,
      });
    }

    if (data.role === "mentor") {
      if (!profile.phone || !profile.identityNumber || !profile.birthDate || !profile.province || !profile.expertiseArea || !profile.experienceYears || !profile.company || !profile.currentRole || !profile.biFrontDoc || (!profile.cvDoc && !profile.certificateDoc)) {
        throw { status: 400, message: "Dados de mentor incompletos." };
      }
      const exists = await findMentorProfileByUserId(user.id);
      if (exists) throw { status: 409, message: "Este utilizador já possui perfil de mentor." };
      const verificationId = `VER-M-${Date.now().toString(36).toUpperCase()}`;
      await createMentorProfile(db, {
        userId: user.id,
        phone: profile.phone,
        identityNumber: profile.identityNumber,
        birthDate: profile.birthDate,
        province: profile.province,
        expertiseArea: profile.expertiseArea,
        experienceYears: Number(profile.experienceYears),
        company: profile.company,
        currentRole: profile.currentRole,
        linkedin: profile.linkedin || null,
        biFrontDoc: profile.biFrontDoc,
        cvDoc: profile.cvDoc || null,
        certificateDoc: profile.certificateDoc || null,
        declareTruth: !!profile.declareTruth,
        acceptTerms: !!profile.acceptTerms,
        verificationId,
      });
      verification = { id: verificationId, status: "pending" };
    }

    if (data.role === "investidor") {
      if (!profile.phone || !profile.identityNumber || !profile.province || !profile.investorType || !profile.biFrontDoc) {
        throw { status: 400, message: "Dados de investidor incompletos." };
      }
      if (profile.investorType === "individual" && (!profile.profession || !profile.incomeSource || !profile.investmentRange)) {
        throw { status: 400, message: "Perfil de investidor individual incompleto." };
      }
      if (profile.investorType === "empresa" && (!profile.companyName || !profile.companyNif || !profile.companyRole || !profile.companyCertificateDoc)) {
        throw { status: 400, message: "Perfil de investidor empresa incompleto." };
      }
      const exists = await findInvestidorProfileByUserId(user.id);
      if (exists) throw { status: 409, message: "Este utilizador já possui perfil de investidor." };
      const verificationId = `VER-I-${Date.now().toString(36).toUpperCase()}`;
      await createInvestidorProfile(db, {
        userId: user.id,
        phone: profile.phone,
        identityNumber: profile.identityNumber,
        province: profile.province,
        investorType: profile.investorType,
        profession: profile.profession || null,
        incomeSource: profile.incomeSource || null,
        investmentRange: profile.investmentRange || null,
        companyName: profile.companyName || null,
        companyNif: profile.companyNif || null,
        companyRole: profile.companyRole || null,
        hasInvestmentExperience: profile.hasInvestmentExperience || null,
        investmentExperienceArea: profile.investmentExperienceArea || null,
        linkedinOrWebsite: profile.linkedinOrWebsite || null,
        biFrontDoc: profile.biFrontDoc,
        companyCertificateDoc: profile.companyCertificateDoc || null,
        declareTruth: !!profile.declareTruth,
        acceptTerms: !!profile.acceptTerms,
        verificationId,
      });
      verification = { id: verificationId, status: "pending" };
    }

    await db.commit();
  } catch (err) {
    await db.rollback();
    throw err;
  } finally {
    db.release();
  }

  const userWithVerification = await enrichUserWithVerification(user, data.role);
  const token = signAccessToken({
    sub: userWithVerification.id,
    role: data.role,
    email: userWithVerification.email,
  });
  return { user: userWithVerification, token, verification };
}

export async function login(input) {
  const data = loginSchema.parse(input);
  const user = await findUserByEmail(data.email);
  if (!user) {
    throw { status: 404, message: "Usuário não existe." };
  }

  const ok = await bcrypt.compare(data.password, user.password_hash);
  if (!ok) {
    throw { status: 401, message: "Senha inválida." };
  }

  const publicUser = await findUserPublicById(user.id);
  const availableRoles = await listAvailableRoles(publicUser);
  const selectedRole = data.role && availableRoles.includes(data.role) ? data.role : publicUser.role;
  const token = signAccessToken({ sub: user.id, role: selectedRole, email: user.email });
  const userWithVerification = await enrichUserWithVerification(publicUser, selectedRole);
  return { user: userWithVerification, token };
}

export async function getMe(userId, activeRole = null) {
  const user = await findUserPublicById(userId);
  if (!user) {
    throw { status: 404, message: "Usuário não encontrado." };
  }
  return enrichUserWithVerification(user, activeRole || user.role);
}

export async function switchRole(authUser, input) {
  const data = switchRoleSchema.parse(input);
  const user = await findUserPublicById(Number(authUser.sub));
  if (!user) throw { status: 404, message: "Usuário não encontrado." };
  const availableRoles = await listAvailableRoles(user);
  if (!availableRoles.includes(data.role)) {
    throw { status: 403, message: "Este usuário não possui o papel solicitado." };
  }
  const userWithVerification = await enrichUserWithVerification(user, data.role);
  const token = signAccessToken({ sub: user.id, role: data.role, email: user.email });
  return { user: userWithVerification, token };
}

export async function updateMyProfile(authUser, input) {
  const data = updateProfileSchema.parse(input || {});
  const role = authUser?.role;
  const userId = Number(authUser?.sub);
  const profile = data.profileData || {};

  if (!userId || !role) throw { status: 401, message: "Sessão inválida." };

  if (role === "empreendedor") {
    await updateEmpreendedorProfileByUserId(userId, {
      phone: profile.phone,
      businessName: profile.businessName,
      businessSector: profile.businessSector,
      businessStage: profile.businessStage,
      businessLocation: profile.businessLocation,
    });
  } else if (role === "mentor") {
    await updateMentorProfileByUserId(userId, {
      phone: profile.phone,
      province: profile.province,
      expertiseArea: profile.expertiseArea,
      experienceYears: profile.experienceYears,
      company: profile.company,
      currentRole: profile.currentRole,
      linkedin: profile.linkedin,
    });
  } else if (role === "investidor") {
    await updateInvestidorProfileByUserId(userId, {
      phone: profile.phone,
      province: profile.province,
      investorType: profile.investorType,
      profession: profile.profession,
      incomeSource: profile.incomeSource,
      investmentRange: profile.investmentRange,
      companyName: profile.companyName,
      companyNif: profile.companyNif,
      companyRole: profile.companyRole,
      hasInvestmentExperience: profile.hasInvestmentExperience,
      investmentExperienceArea: profile.investmentExperienceArea,
      linkedinOrWebsite: profile.linkedinOrWebsite,
    });
  } else {
    throw { status: 400, message: "Este tipo de conta não possui perfil editável." };
  }

  const user = await findUserPublicById(userId);
  const userWithVerification = await enrichUserWithVerification(user, role);
  return { user: userWithVerification };
}
