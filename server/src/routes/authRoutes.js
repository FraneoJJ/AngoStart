import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.get("/reset-password/validate", authController.validateResetToken);
router.post("/reset-password", authController.resetPassword);
router.get("/me", requireAuth, authController.me);
router.post("/switch-role", requireAuth, authController.switchRole);
router.patch("/profile", requireAuth, authController.updateProfile);

export default router;
