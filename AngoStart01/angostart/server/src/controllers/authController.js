import { ZodError } from "zod";
import * as authService from "../services/authService.js";

export async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    return res.status(201).json({ success: true, ...result });
  } catch (err) {
    if (err instanceof ZodError) {
      return next({ status: 400, message: err.issues?.[0]?.message || "Dados inválidos." });
    }
    return next(err);
  }
}

export async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    if (err instanceof ZodError) {
      return next({ status: 400, message: err.issues?.[0]?.message || "Dados inválidos." });
    }
    return next(err);
  }
}

export async function me(req, res, next) {
  try {
    const userId = Number(req.user?.sub);
    const user = await authService.getMe(userId, req.user?.role);
    return res.status(200).json({ success: true, user });
  } catch (err) {
    return next(err);
  }
}

export async function switchRole(req, res, next) {
  try {
    const result = await authService.switchRole(req.user, req.body);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    if (err instanceof ZodError) {
      return next({ status: 400, message: err.issues?.[0]?.message || "Dados inválidos." });
    }
    return next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const result = await authService.updateMyProfile(req.user, req.body);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    if (err instanceof ZodError) {
      return next({ status: 400, message: err.issues?.[0]?.message || "Dados inválidos." });
    }
    return next(err);
  }
}
