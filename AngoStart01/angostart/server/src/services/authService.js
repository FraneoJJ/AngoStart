import bcrypt from "bcryptjs";
import { z } from "zod";
import {
  createUser,
  findUserByEmail,
  findUserPublicById,
  USER_ROLES,
} from "../models/userModel.js";
import { signAccessToken } from "../utils/jwt.js";

const registerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(6).max(120),
  role: z.enum(USER_ROLES).default("empreendedor"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(120),
});

export async function register(input) {
  const data = registerSchema.parse(input);
  const existing = await findUserByEmail(data.email);
  if (existing) {
    throw { status: 409, message: "Email já cadastrado." };
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await createUser({
    name: data.name,
    email: data.email,
    passwordHash,
    role: data.role,
  });

  const token = signAccessToken({ sub: user.id, role: user.role, email: user.email });
  return { user, token };
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
  return { user: publicUser, token };
}

export async function getMe(userId) {
  const user = await findUserPublicById(userId);
  if (!user) {
    throw { status: 404, message: "Usuário não encontrado." };
  }
  return user;
}
