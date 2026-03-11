import { Router } from "express";
import * as adminController from "../controllers/adminController.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";

const router = Router();

router.get("/users", requireAuth, requireRole("admin"), adminController.users);
router.get(
  "/reports/performance",
  requireAuth,
  requireRole("admin"),
  adminController.performanceReport
);
router.get(
  "/investors",
  requireAuth,
  requireRole("empreendedor", "admin"),
  adminController.investors
);
router.get(
  "/investors/:id",
  requireAuth,
  requireRole("empreendedor", "admin"),
  adminController.investorById
);
router.patch(
  "/users/:id/verification",
  requireAuth,
  requireRole("admin"),
  adminController.updateVerification
);

export default router;
