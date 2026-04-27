import { Router } from "express";
import * as ideaProgressController from "../controllers/ideaProgressController.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";

const router = Router();

router.post("/", requireAuth, requireRole("admin", "empreendedor"), ideaProgressController.create);
router.get("/:ideaId", requireAuth, requireRole("admin", "empreendedor"), ideaProgressController.byIdea);

export default router;
