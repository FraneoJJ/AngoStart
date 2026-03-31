import { Router } from "express";
import * as chatController from "../controllers/chatController.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.get("/conversations", requireAuth, chatController.conversations);
router.get("/online", requireAuth, chatController.online);
router.get("/calls/:userId", requireAuth, chatController.calls);
router.get("/messages/:userId", requireAuth, chatController.messages);
router.post("/messages", requireAuth, chatController.send);

export default router;
