import { Server } from "socket.io";
import { verifyAccessToken } from "../utils/jwt.js";
import { sendChatMessage } from "../services/chatService.js";
import {
  registerCallAccepted,
  registerCallEnded,
  registerCallInvite,
  registerCallRejected,
} from "../services/callService.js";

const onlineUsers = new Map();
let ioInstance = null;

function addOnlineUser(userId, socketId) {
  const key = String(userId);
  const current = onlineUsers.get(key) || new Set();
  current.add(socketId);
  onlineUsers.set(key, current);
}

function removeOnlineUser(userId, socketId) {
  const key = String(userId);
  const current = onlineUsers.get(key);
  if (!current) return;
  current.delete(socketId);
  if (current.size === 0) onlineUsers.delete(key);
}

function emitPresenceSnapshot(io) {
  io.emit("presence:snapshot", { onlineUserIds: getOnlineUserIds() });
}

export function getOnlineUserIds() {
  return Array.from(onlineUsers.keys()).map((id) => Number(id)).filter(Boolean);
}

export function emitToUser(userId, event, payload) {
  if (!ioInstance || !userId) return;
  ioInstance.to(`user:${Number(userId)}`).emit(event, payload);
}

export function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: true,
      credentials: true,
    },
  });
  ioInstance = io;

  io.use((socket, next) => {
    try {
      const token =
        socket.handshake?.auth?.token ||
        (socket.handshake?.headers?.authorization || "").replace(/^Bearer\s+/i, "");
      if (!token) return next(new Error("Token ausente."));
      const payload = verifyAccessToken(token);
      socket.data.user = payload;
      next();
    } catch {
      next(new Error("Token inválido."));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.data.user;
    const userId = Number(user?.sub || 0);
    if (!userId) {
      socket.disconnect(true);
      return;
    }

    socket.join(`user:${userId}`);
    addOnlineUser(userId, socket.id);
    emitPresenceSnapshot(io);

    socket.on("chat:send", async (payload, ack) => {
      try {
        const message = await sendChatMessage(user, payload || {});
        if (!message) throw new Error("Falha ao enviar mensagem.");
        emitToUser(message.senderId, "chat:new", message);
        emitToUser(message.receiverId, "chat:new", message);
        if (typeof ack === "function") ack({ ok: true, message });
      } catch (err) {
        const errorText = err?.message || "Falha ao enviar mensagem.";
        if (typeof ack === "function") ack({ ok: false, error: errorText });
      }
    });

    socket.on("call:invite", (payload = {}) => {
      const toUserId = Number(payload.toUserId || 0);
      if (!toUserId) return;
      registerCallInvite({
        channelName: payload.channelName || "",
        callerId: userId,
        receiverId: toUserId,
        callType: payload.callType === "voice" ? "voice" : "video",
      }).catch(() => {});
      emitToUser(toUserId, "call:incoming", {
        fromUserId: userId,
        fromUserName: user?.name || "Utilizador",
        channelName: payload.channelName || "",
        callType: payload.callType === "voice" ? "voice" : "video",
      });
    });

    socket.on("call:accept", (payload = {}) => {
      const toUserId = Number(payload.toUserId || 0);
      if (!toUserId) return;
      registerCallAccepted({ channelName: payload.channelName || "" }).catch(() => {});
      emitToUser(toUserId, "call:accepted", {
        byUserId: userId,
        channelName: payload.channelName || "",
        callType: payload.callType === "voice" ? "voice" : "video",
      });
    });

    socket.on("call:reject", (payload = {}) => {
      const toUserId = Number(payload.toUserId || 0);
      if (!toUserId) return;
      registerCallRejected({
        channelName: payload.channelName || "",
        endedByUserId: userId,
      }).catch(() => {});
      emitToUser(toUserId, "call:rejected", {
        byUserId: userId,
        channelName: payload.channelName || "",
      });
    });

    socket.on("call:end", (payload = {}) => {
      const toUserId = Number(payload.toUserId || 0);
      if (!toUserId) return;
      registerCallEnded({
        channelName: payload.channelName || "",
        endedByUserId: userId,
      }).catch(() => {});
      emitToUser(toUserId, "call:ended", {
        byUserId: userId,
        channelName: payload.channelName || "",
      });
    });

    socket.on("disconnect", () => {
      removeOnlineUser(userId, socket.id);
      emitPresenceSnapshot(io);
    });
  });

  return io;
}
