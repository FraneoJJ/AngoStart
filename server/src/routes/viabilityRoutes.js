import { Router } from "express";
import * as viabilityController from "../controllers/viabilityController.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.post("/viability", requireAuth, viabilityController.analyze);
router.get("/viability/:ideaId/latest", requireAuth, viabilityController.latestByIdea);

export default router;
