import { Router } from "express";
import * as legalController from "../controllers/legalController.js";
import { requireAuth } from "../middlewares/auth.js";
import { requirePlanFeature } from "../middlewares/subscription.js";

const router = Router();

router.get("/flow", legalController.flow);
router.get("/progress", requireAuth, legalController.progress);
router.post("/progress", requireAuth, legalController.updateProgress);
router.post("/company-guide", requireAuth, requirePlanFeature("legal_company_guide"), legalController.companyGuide);
router.get("/company-guide/latest", requireAuth, legalController.latestCompanyGuide);

export default router;
