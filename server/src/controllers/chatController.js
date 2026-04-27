import { ZodError } from "zod";
import * as chatService from "../services/chatService.js";
import { getOnlineUserIds } from "../realtime/socketServer.js";
import { getCallHistory } from "../services/callService.js";

export async function conversations(req, res, next) {
  try {
    const conversations = await chatService.listConversations(req.user);
    res.status(200).json({ success: true, conversations });
  } catch (err) {
    next(err);
  }
}

export async function messages(req, res, next) {
  try {
    const messages = await chatService.getConversation(req.user, req.params.userId);
    res.status(200).json({ success: true, messages });
  } catch (err) {
    next(err);
  }
}

export async function send(req, res, next) {
  try {
    const message = await chatService.sendChatMessage(req.user, req.body);
    res.status(201).json({ success: true, message });
  } catch (err) {
    if (err instanceof ZodError) {
      return next({ status: 400, message: err.issues?.[0]?.message || "Payload inválido." });
    }
    next(err);
  }
}

export async function broadcast(req, res, next) {
  try {
    const result = await chatService.sendBroadcastMessage(req.user, req.body);
    res.status(201).json({ success: true, ...result });
  } catch (err) {
    if (err instanceof ZodError) {
      return next({ status: 400, message: err.issues?.[0]?.message || "Payload inválido." });
    }
    next(err);
  }
}

export function online(_req, res) {
  res.status(200).json({ success: true, onlineUserIds: getOnlineUserIds() });
}

export async function calls(req, res, next) {
  try {
    const calls = await getCallHistory(req.user, req.params.userId);
    res.status(200).json({ success: true, calls });
  } catch (err) {
    next(err);
  }
}
