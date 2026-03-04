import { ZodError } from "zod";
import * as subscriptionService from "../services/subscriptionService.js";

export async function plans(_req, res, next) {
  try {
    const plansData = await subscriptionService.listPlans();
    res.status(200).json({ success: true, plans: plansData });
  } catch (err) {
    next(err);
  }
}

export async function current(req, res, next) {
  try {
    const subscription = await subscriptionService.getCurrentSubscription(req.user);
    res.status(200).json({ success: true, subscription });
  } catch (err) {
    next(err);
  }
}

export async function change(req, res, next) {
  try {
    const subscription = await subscriptionService.changeSubscriptionPlan(req.user, req.body);
    res.status(200).json({ success: true, subscription });
  } catch (err) {
    if (err instanceof ZodError) {
      return next({ status: 400, message: err.issues?.[0]?.message || "Payload inválido." });
    }
    next(err);
  }
}
