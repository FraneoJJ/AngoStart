import { Router } from "express";
import * as viabilityController from "../controllers/viabilityController.js";
import { requireAuth } from "../middlewares/auth.js";
import { requirePlanFeature } from "../middlewares/subscription.js";

const router = Router();

router.post("/viability", requireAuth, requirePlanFeature("viability_analysis"), viabilityController.analyze);

export default router;
