import { Router } from "express";
import * as ideaController from "../controllers/ideaController.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";

const router = Router();

router.get("/marketplace", ideaController.marketplace);
router.get("/mine", requireAuth, ideaController.myIdeas);
router.get("/:id", requireAuth, ideaController.byId);

router.post(
  "/",
  requireAuth,
  requireRole("admin", "empreendedor"),
  ideaController.create
);

router.put(
  "/:id",
  requireAuth,
  requireRole("admin", "empreendedor"),
  ideaController.update
);
router.patch(
  "/:id/status",
  requireAuth,
  requireRole("admin", "empreendedor"),
  ideaController.updateStatus
);

export default router;
