import { ZodError } from "zod";
import * as ideaService from "../services/ideaService.js";

export async function create(req, res, next) {
  try {
    const idea = await ideaService.createIdeaForUser(req.user, req.body);
    res.status(201).json({ success: true, idea });
  } catch (err) {
    if (err instanceof ZodError) {
      return next({ status: 400, message: err.issues?.[0]?.message || "Payload inválido." });
    }
    next(err);
  }
}

export async function myIdeas(req, res, next) {
  try {
    const ideas = await ideaService.listMyIdeas(req.user);
    res.status(200).json({ success: true, ideas });
  } catch (err) {
    next(err);
  }
}

export async function byId(req, res, next) {
  try {
    const idea = await ideaService.getIdeaById(req.params.id);
    res.status(200).json({ success: true, idea });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const idea = await ideaService.updateIdea(req.user, req.params.id, req.body);
    res.status(200).json({ success: true, idea });
  } catch (err) {
    if (err instanceof ZodError) {
      return next({ status: 400, message: err.issues?.[0]?.message || "Payload inválido." });
    }
    next(err);
  }
}

export async function marketplace(req, res, next) {
  try {
    const ideas = await ideaService.marketplaceIdeas();
    res.status(200).json({ success: true, ideas });
  } catch (err) {
    next(err);
  }
}
