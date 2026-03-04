import { Router } from "express";
import * as subscriptionController from "../controllers/subscriptionController.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.get("/plans", subscriptionController.plans);
router.get("/current", requireAuth, subscriptionController.current);
router.post("/change", requireAuth, subscriptionController.change);

export default router;
