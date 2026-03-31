import { ZodError } from "zod";
import { generateRtcToken } from "../services/agoraService.js";

export function token(req, res, next) {
  try {
    const data = generateRtcToken(req.user, req.body);
    res.status(200).json({ success: true, ...data });
  } catch (err) {
    if (err instanceof ZodError) {
      return next({ status: 400, message: err.issues?.[0]?.message || "Payload inválido." });
    }
    next(err);
  }
}
