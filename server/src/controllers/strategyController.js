import { ZodError } from "zod";
import * as strategyService from "../services/strategyService.js";

export async function checklist(req, res, next) {
  try {
    const track = req.query.track || "validacao";
    const context = {
      sector: req.query.sector || "",
      city: req.query.city || "",
      initialCapital: Number(req.query.initialCapital || 0),
      viabilityScore: Number(req.query.viabilityScore || 0),
      hasMvp: String(req.query.hasMvp || "").toLowerCase() === "true",
    };
    const steps = await strategyService.getStrategicChecklist({ track, context });
    res.status(200).json({ success: true, track, steps });
  } catch (err) {
    if (err instanceof ZodError) {
      return next({ status: 400, message: err.issues?.[0]?.message || "Parâmetros inválidos." });
    }
    next(err);
  }
}

export async function progress(req, res, next) {
  try {
    const progressItems = await strategyService.getStrategicProgress(req.user, req.query.ideaId);
    res.status(200).json({ success: true, progress: progressItems });
  } catch (err) {
    next(err);
  }
}

export async function updateProgress(req, res, next) {
  try {
    await strategyService.updateStrategicProgress(req.user, req.body);
    res.status(200).json({ success: true });
  } catch (err) {
    if (err instanceof ZodError) {
      return next({ status: 400, message: err.issues?.[0]?.message || "Payload inválido." });
    }
    next(err);
  }
}
