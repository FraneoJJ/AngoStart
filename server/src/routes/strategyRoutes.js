import { Router } from "express";
import * as strategyController from "../controllers/strategyController.js";
import { requireAuth } from "../middlewares/auth.js";
import { requirePlanFeature } from "../middlewares/subscription.js";

const router = Router();

router.get("/checklist", requireAuth, requirePlanFeature("strategy_checklist"), strategyController.checklist);
router.get("/progress", requireAuth, requirePlanFeature("strategy_checklist"), strategyController.progress);
router.post("/progress", requireAuth, requirePlanFeature("strategy_checklist"), strategyController.updateProgress);

export default router;
