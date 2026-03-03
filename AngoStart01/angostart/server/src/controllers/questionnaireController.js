import { ZodError } from "zod";
import * as questionnaireService from "../services/questionnaireService.js";

export async function generate(req, res, next) {
  try {
    const session = await questionnaireService.generateSession(req.user, req.body);
    res.status(201).json({ success: true, session });
  } catch (err) {
    if (err instanceof ZodError) {
      return next({ status: 400, message: err.issues?.[0]?.message || "Payload inválido." });
    }
    next(err);
  }
}

export async function saveAnswers(req, res, next) {
  try {
    const data = await questionnaireService.saveSessionAnswers(req.params.sessionId, req.body);
    res.status(200).json({ success: true, ...data });
  } catch (err) {
    if (err instanceof ZodError) {
      return next({ status: 400, message: err.issues?.[0]?.message || "Payload inválido." });
    }
    next(err);
  }
}

export async function getSession(req, res, next) {
  try {
    const session = await questionnaireService.getSession(req.params.sessionId);
    res.status(200).json({ success: true, session });
  } catch (err) {
    next(err);
  }
}
