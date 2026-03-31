import { Router } from "express";
import * as mentorshipController from "../controllers/mentorshipController.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";

const router = Router();

router.post(
  "/requests",
  requireAuth,
  requireRole("empreendedor"),
  mentorshipController.createRequest
);
router.get(
  "/requests/mine",
  requireAuth,
  requireRole("empreendedor"),
  mentorshipController.myRequests
);
router.get(
  "/mentor/requests",
  requireAuth,
  requireRole("mentor"),
  mentorshipController.mentorRequests
);
router.patch(
  "/mentor/requests/:id",
  requireAuth,
  requireRole("mentor"),
  mentorshipController.updateMentorRequest
);

export default router;
