import { ZodError } from "zod";
import * as mentorshipService from "../services/mentorshipService.js";

export async function createRequest(req, res, next) {
  try {
    const request = await mentorshipService.createMentorshipRequestForEntrepreneur(req.user, req.body);
    res.status(201).json({ success: true, request });
  } catch (err) {
    if (err instanceof ZodError) {
      return next({ status: 400, message: err.issues?.[0]?.message || "Payload inválido." });
    }
    next(err);
  }
}

export async function myRequests(req, res, next) {
  try {
    const requests = await mentorshipService.listEntrepreneurRequests(req.user);
    res.status(200).json({ success: true, requests });
  } catch (err) {
    next(err);
  }
}

export async function mentorRequests(req, res, next) {
  try {
    const requests = await mentorshipService.listMentorRequests(req.user);
    res.status(200).json({ success: true, requests });
  } catch (err) {
    next(err);
  }
}

export async function updateMentorRequest(req, res, next) {
  try {
    const request = await mentorshipService.updateMentorRequest(req.user, req.params.id, req.body);
    res.status(200).json({ success: true, request });
  } catch (err) {
    if (err instanceof ZodError) {
      return next({ status: 400, message: err.issues?.[0]?.message || "Payload inválido." });
    }
    next(err);
  }
}
