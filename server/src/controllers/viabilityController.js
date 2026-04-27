import { ZodError } from "zod";
import { analyzeViability, getLatestViabilityReportByIdeaId } from "../services/viabilityService.js";

export async function analyze(req, res, next) {
  try {
    const report = await analyzeViability(req.body);
    res.status(200).json({ success: true, report });
  } catch (err) {
    if (err instanceof ZodError) {
      return next({ status: 400, message: err.issues?.[0]?.message || "Payload inválido." });
    }
    next(err);
  }
}

export async function latestByIdea(req, res, next) {
  try {
    const report = await getLatestViabilityReportByIdeaId(req.params.ideaId);
    res.status(200).json({ success: true, report });
  } catch (err) {
    next(err);
  }
}
