import { Router } from "express";
import * as adminController from "../controllers/adminController.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";

const router = Router();

router.get("/users", requireAuth, requireRole("admin"), adminController.users);
router.patch(
  "/users/:id/verification",
  requireAuth,
  requireRole("admin"),
  adminController.updateVerification
);

export default router;
