import { ZodError } from "zod";
import * as legalService from "../services/legalService.js";

export async function flow(req, res, next) {
  try {
    const track = req.query.track || "empresa_angola";
    const steps = await legalService.getLegalFlow(track);
    res.status(200).json({ success: true, track, steps });
  } catch (err) {
    next(err);
  }
}

export async function progress(req, res, next) {
  try {
    const progressItems = await legalService.getLegalProgress(req.user, req.query.ideaId);
    res.status(200).json({ success: true, progress: progressItems });
  } catch (err) {
    next(err);
  }
}

export async function updateProgress(req, res, next) {
  try {
    await legalService.updateLegalProgress(req.user, req.body);
    res.status(200).json({ success: true });
  } catch (err) {
    if (err instanceof ZodError) {
      return next({ status: 400, message: err.issues?.[0]?.message || "Payload inválido." });
    }
    next(err);
  }
}

export async function companyGuide(req, res, next) {
  try {
    const guide = await legalService.generateCompanyGuide(req.user, req.body);
    res.status(200).json({ success: true, guide });
  } catch (err) {
    if (err instanceof ZodError) {
      return next({ status: 400, message: err.issues?.[0]?.message || "Payload inválido." });
    }
    next(err);
  }
}

export async function latestCompanyGuide(req, res, next) {
  try {
    const guide = await legalService.getLatestCompanyGuide(req.user);
    res.status(200).json({ success: true, guide });
  } catch (err) {
    next(err);
  }
}
