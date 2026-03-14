import { ZodError } from "zod";
import * as adminService from "../services/adminService.js";

export async function users(_req, res, next) {
  try {
    const data = await adminService.listAdminUsers();
    res.status(200).json({ success: true, users: data });
  } catch (err) {
    next(err);
  }
}

export async function updateVerification(req, res, next) {
  try {
    const updatedUser = await adminService.setUserVerification(req.params.id, req.body);
    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    if (err instanceof ZodError) {
      return next({ status: 400, message: err.issues?.[0]?.message || "Payload inválido." });
    }
    next(err);
  }
}

export async function investors(req, res, next) {
  try {
    const data = await adminService.listInvestorsForEntrepreneur();
    res.status(200).json({ success: true, investors: data });
  } catch (err) {
    next(err);
  }
}

export async function mentors(req, res, next) {
  try {
    const data = await adminService.listMentorsForEntrepreneur();
    res.status(200).json({ success: true, mentors: data });
  } catch (err) {
    next(err);
  }
}

export async function mentorById(req, res, next) {
  try {
    const mentor = await adminService.getMentorDetailsForEntrepreneur(req.params.id);
    res.status(200).json({ success: true, mentor });
  } catch (err) {
    next(err);
  }
}

export async function investorById(req, res, next) {
  try {
    const investor = await adminService.getInvestorDetailsForEntrepreneur(req.params.id);
    res.status(200).json({ success: true, investor });
  } catch (err) {
    next(err);
  }
}

export async function performanceReport(req, res, next) {
  try {
    const month = String(req.query?.month || "");
    const report = await adminService.getPerformanceReport(month);
    res.status(200).json({ success: true, report });
  } catch (err) {
    next(err);
  }
}

export async function ideas(_req, res, next) {
  try {
    const ideas = await adminService.listAdminIdeas();
    res.status(200).json({ success: true, ideas });
  } catch (err) {
    next(err);
  }
}
