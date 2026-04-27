import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { pool } from "../config/db.js";
import {
  createUser,
  findUserByEmail,
  findUserPublicById,
  updateUserAvatarById,
  updateUserPasswordHashById,
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
import {
  createPasswordResetToken,
  ensurePasswordResetTable,
  findValidPasswordResetTokenByHash,
  invalidateActiveTokensByUserId,
  markPasswordResetTokenAsUsed,
} from "../models/passwordResetModel.js";
import { signAccessToken } from "../utils/jwt.js";
import { env } from "../config/env.js";
import { sendPasswordResetEmail } from "./mailService.js";

const profileSchema = z.object({
  phone: z.string().min(6).max(30).optional(),
  hasBusiness: z.coerce.boolean().optional(),
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
}).superRefine((data, ctx) => {
  const reservedTokens = ["angostart"];
  const normalizeForCheck = (value) => String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  const nameCheck = normalizeForCheck(data.name);
  const emailCheck = normalizeForCheck(data.email);
  const hasReservedName = reservedTokens.some((token) => nameCheck.includes(token));
  const hasReservedEmail = reservedTokens.some((token) => emailCheck.includes(token));

  if (hasReservedName) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["name"],
      message: "Este nome está reservado e não pode ser utilizado no registo.",
    });
  }

  if (hasReservedEmail) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["email"],
      message: "Este email contém termo reservado da plataforma e não pode ser utilizado.",
    });
  }
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
  profileData: profileSchema.optional(),
  avatarDataUrl: z.string().max(2_500_000).optional(),
}).refine((val) => !!val.profileData || !!val.avatarDataUrl, {
  message: "Envie dados de perfil ou foto de perfil.",
});

function isSupportedAvatarDataUrl(value) {
  const raw = String(value || "").trim();
  return /^data:image\/(jpeg|jpg|png|webp);base64,[a-z0-9+/=]+$/i.test(raw);
}

function approxDataUrlBytes(dataUrl) {
  const base64 = String(dataUrl || "").split(",")[1] || "";
  const len = base64.length;
  return Math.floor((len * 3) / 4);
}

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string().min(20).max(300),
  newPassword: z.string().min(8).max(120),
});

async function listAvailableRoles(user) {
  if (!user) return [];
  const userId = Number(user.id);
  const roles = new Set();
  if (user.role === "admin") roles.add("admin");
  if (await findEmpreendedorProfileByUserId(userId)) roles.add("empreendedor");
  if (await findMentorProfileByUserId(userId)) roles.add("mentor");
  if (await findInvestidorProfileByUserId(userId)) roles.add("investidor");
  if (roles.size === 0) roles.add(user.role);
  return Array.from(roles);
}

async function enrichUserWithVerification(user, activeRole = null) {
  if (!user) return user;
  const selectedRole = activeRole || user.role;
  const verification = await findVerificationByUserRole(Number(user.id), selectedRole);
  const profileData = await findProfileDataByUserRole(Number(user.id), selectedRole);
  const availableRoles = await listAvailableRoles(user);
  const fallbackVerification = selectedRole === "admin" ? "approved" : "pending";
  return {
    ...user,
    primaryRole: user.role,
    role: selectedRole,
    availableRoles,
    verificationStatus: verification?.verification_status || fallbackVerification,
    verificationId: verification?.verification_id || null,
    avatarUrl: user?.avatar_url || null,
    profileData: profileData || {},
    adminCategory: typeof user?.admin_category === "string" ? user.admin_category : null,
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
      const hasBusiness = !!profile.hasBusiness;
      if (!profile.phone) {
        throw { status: 400, message: "Telefone é obrigatório para empreendedor." };
      }
      if (hasBusiness && (!profile.businessName || !profile.businessSector || !profile.businessStage)) {
        throw { status: 400, message: "Dados do negócio incompletos para empreendedor." };
      }
      const exists = await findEmpreendedorProfileByUserId(user.id);
      if (exists) throw { status: 409, message: "Este utilizador já possui perfil de empreendedor." };
      const verificationId = `VER-E-${Date.now().toString(36).toUpperCase()}`;
      await createEmpreendedorProfile(db, {
        userId: user.id,
        phone: profile.phone,
        hasBusiness,
        businessName: hasBusiness ? profile.businessName : null,
        businessSector: hasBusiness ? profile.businessSector : null,
        businessStage: hasBusiness ? profile.businessStage : null,
        businessLocation: profile.businessLocation || null,
        acceptTerms: !!profile.acceptTerms,
        verificationId,
      });
      verification = { id: verificationId, status: "pending" };
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
    adminCategory: userWithVerification.adminCategory,
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
  const selectedRole = data.role && availableRoles.includes(data.role)
    ? data.role
    : (availableRoles.includes(publicUser.role) ? publicUser.role : (availableRoles[0] || publicUser.role));
  const userWithVerification = await enrichUserWithVerification(publicUser, selectedRole);
  const token = signAccessToken({ sub: user.id, role: selectedRole, email: user.email, adminCategory: userWithVerification.adminCategory });
  return { user: userWithVerification, token };
}

export async function getMe(userId, activeRole = null) {
  const user = await findUserPublicById(userId);
  if (!user) {
    throw { status: 404, message: "Usuário não encontrado." };
  }
  const availableRoles = await listAvailableRoles(user);
  const preferredRole = activeRole && availableRoles.includes(activeRole)
    ? activeRole
    : (availableRoles.includes(user.role) ? user.role : (availableRoles[0] || user.role));
  return enrichUserWithVerification(user, preferredRole);
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
  const token = signAccessToken({ sub: user.id, role: data.role, email: user.email, adminCategory: userWithVerification.adminCategory });
  return { user: userWithVerification, token };
}

export async function updateMyProfile(authUser, input) {
  const data = updateProfileSchema.parse(input || {});
  const role = authUser?.role;
  const userId = Number(authUser?.sub);
  const profile = data.profileData || {};
  const avatarDataUrl = data.avatarDataUrl ? String(data.avatarDataUrl).trim() : "";

  if (!userId || !role) throw { status: 401, message: "Sessão inválida." };

  if (data.profileData) {
    if (role === "empreendedor") {
      await updateEmpreendedorProfileByUserId(userId, {
        phone: profile.phone,
        hasBusiness: profile.hasBusiness,
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
  }

  if (avatarDataUrl) {
    if (!isSupportedAvatarDataUrl(avatarDataUrl)) {
      throw { status: 400, message: "Formato de foto inválido. Use JPG, PNG ou WEBP." };
    }
    const bytes = approxDataUrlBytes(avatarDataUrl);
    if (bytes > 700 * 1024) {
      throw { status: 400, message: "A foto está pesada. Use uma imagem menor (até ~700KB)." };
    }
    await updateUserAvatarById(userId, avatarDataUrl);
  }

  const user = await findUserPublicById(userId);
  const userWithVerification = await enrichUserWithVerification(user, role);
  return { user: userWithVerification };
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function buildPasswordResetUrl(token) {
  const base = env.FRONTEND_ORIGIN || "http://localhost:5173";
  const basePath = String(env.FRONTEND_BASE_PATH || "")
    .trim()
    .replace(/^\/?/, "/")
    .replace(/\/+$/, "");
  const appRoot = `${base.replace(/\/+$/, "")}${basePath === "/" ? "" : basePath}`;
  return `${appRoot}/#/redefinir-senha?token=${encodeURIComponent(token)}`;
}

export async function requestPasswordReset(input) {
  const data = forgotPasswordSchema.parse(input);
  await ensurePasswordResetTable();

  const user = await findUserByEmail(data.email);
  if (!user) {
    throw {
      status: 404,
      message: "O e-mail não está cadastrado na AngoStart não pode recuperar senha de uma conta que não existe!",
    };
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = sha256(rawToken);
  const ttl = Math.max(5, Number(env.PASSWORD_RESET_TTL_MINUTES || 30));
  const expiresAt = new Date(Date.now() + ttl * 60 * 1000);

  await invalidateActiveTokensByUserId(Number(user.id));
  await createPasswordResetToken({
    userId: Number(user.id),
    tokenHash,
    expiresAt,
  });

  const resetUrl = buildPasswordResetUrl(rawToken);
  await sendPasswordResetEmail({
    to: user.email,
    resetUrl,
  });

  return {
    message: "Email de recuperação enviado com sucesso.",
  };
}

export async function validatePasswordResetToken(input) {
  const token = String(input?.token || "");
  if (!token) {
    throw { status: 400, message: "Token de recuperação ausente." };
  }
  await ensurePasswordResetTable();
  const tokenHash = sha256(token);
  const row = await findValidPasswordResetTokenByHash(tokenHash);
  if (!row) {
    throw { status: 400, message: "Token inválido ou expirado." };
  }
  return { valid: true };
}

export async function resetPassword(input) {
  const data = resetPasswordSchema.parse(input);
  await ensurePasswordResetTable();

  const tokenHash = sha256(data.token);
  const row = await findValidPasswordResetTokenByHash(tokenHash);
  if (!row) {
    throw { status: 400, message: "Token inválido ou expirado." };
  }

  const passwordHash = await bcrypt.hash(data.newPassword, 10);
  await updateUserPasswordHashById(Number(row.user_id), passwordHash);
  await markPasswordResetTokenAsUsed(Number(row.id));
  await invalidateActiveTokensByUserId(Number(row.user_id));

  return { message: "Senha redefinida com sucesso." };
}
