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
  findVerificationByUserRole,
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
});

async function enrichUserWithVerification(user) {
  if (!user) return user;
  const verification = await findVerificationByUserRole(Number(user.id), user.role);
  return {
    ...user,
    verificationStatus: verification?.verification_status || "approved",
    verificationId: verification?.verification_id || null,
  };
}

export async function register(input) {
  const data = registerSchema.parse(input);
  const existing = await findUserByEmail(data.email);
  if (existing) {
    throw { status: 409, message: "Email já cadastrado." };
  }

  const profile = data.profileData || {};
  const passwordHash = await bcrypt.hash(data.password, 10);
  const db = await pool.getConnection();
  let user = null;
  let verification = null;
  try {
    await db.beginTransaction();
    user = await createUser(
      {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
      },
      db
    );

    if (!user) {
      throw { status: 500, message: "Falha ao criar utilizador." };
    }

    if (data.role === "empreendedor") {
      if (!profile.phone || !profile.businessName || !profile.businessSector || !profile.businessStage) {
        throw { status: 400, message: "Dados do negócio incompletos para empreendedor." };
      }
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
      if (
        !profile.phone ||
        !profile.identityNumber ||
        !profile.birthDate ||
        !profile.province ||
        !profile.expertiseArea ||
        !profile.experienceYears ||
        !profile.company ||
        !profile.currentRole ||
        !profile.biFrontDoc ||
        (!profile.cvDoc && !profile.certificateDoc)
      ) {
        throw { status: 400, message: "Dados de mentor incompletos." };
      }
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
      if (
        !profile.phone ||
        !profile.identityNumber ||
        !profile.province ||
        !profile.investorType ||
        !profile.biFrontDoc
      ) {
        throw { status: 400, message: "Dados de investidor incompletos." };
      }
      if (
        profile.investorType === "individual" &&
        (!profile.profession || !profile.incomeSource || !profile.investmentRange)
      ) {
        throw { status: 400, message: "Perfil de investidor individual incompleto." };
      }
      if (
        profile.investorType === "empresa" &&
        (!profile.companyName || !profile.companyNif || !profile.companyRole || !profile.companyCertificateDoc)
      ) {
        throw { status: 400, message: "Perfil de investidor empresa incompleto." };
      }
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

  const userWithVerification = await enrichUserWithVerification(user);
  const token = signAccessToken({
    sub: userWithVerification.id,
    role: userWithVerification.role,
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

  const token = signAccessToken({ sub: user.id, role: user.role, email: user.email });
  const publicUser = await findUserPublicById(user.id);
  const userWithVerification = await enrichUserWithVerification(publicUser);
  return { user: userWithVerification, token };
}

export async function getMe(userId) {
  const user = await findUserPublicById(userId);
  if (!user) {
    throw { status: 404, message: "Usuário não encontrado." };
  }
  return enrichUserWithVerification(user);
}
