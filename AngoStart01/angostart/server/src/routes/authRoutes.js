import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", requireAuth, authController.me);
router.post("/switch-role", requireAuth, authController.switchRole);

export default router;
