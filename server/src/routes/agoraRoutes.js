import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import * as agoraController from "../controllers/agoraController.js";

const router = Router();

router.post("/token", requireAuth, agoraController.token);

export default router;
