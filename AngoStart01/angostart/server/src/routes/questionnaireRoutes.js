import { Router } from "express";
import * as questionnaireController from "../controllers/questionnaireController.js";
import { requireAuth } from "../middlewares/auth.js";
import { requirePlanFeature } from "../middlewares/subscription.js";

const router = Router();

router.post("/generate", requireAuth, requirePlanFeature("dynamic_questionnaire"), questionnaireController.generate);
router.get("/:sessionId", requireAuth, questionnaireController.getSession);
router.post("/:sessionId/answers", requireAuth, questionnaireController.saveAnswers);

export default router;
