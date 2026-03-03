import { Router } from "express";
import * as questionnaireController from "../controllers/questionnaireController.js";

const router = Router();

// Aberto para permitir uso durante transição do login API.
router.post("/generate", questionnaireController.generate);
router.get("/:sessionId", questionnaireController.getSession);
router.post("/:sessionId/answers", questionnaireController.saveAnswers);

export default router;
