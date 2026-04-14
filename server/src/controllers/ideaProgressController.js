import { ZodError } from "zod";
import * as ideaProgressService from "../services/ideaProgressService.js";

export async function create(req, res, next) {
  try {
    const progress = await ideaProgressService.saveIdeaProgress(req.user, req.body);
    res.status(201).json({ success: true, progress });
  } catch (err) {
    if (err instanceof ZodError) {
      return next({ status: 400, message: err.issues?.[0]?.message || "Payload inválido." });
    }
    next(err);
  }
}

export async function byIdea(req, res, next) {
  try {
    const progress = await ideaProgressService.getIdeaProgressByIdea(req.user, req.params.ideaId);
    res.status(200).json({ success: true, progress });
  } catch (err) {
    if (err instanceof ZodError) {
      return next({ status: 400, message: err.issues?.[0]?.message || "Parâmetros inválidos." });
    }
    next(err);
  }
}
