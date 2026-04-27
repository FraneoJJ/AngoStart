import { io } from "socket.io-client";
import { requestJson } from "./httpClient";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

let socket = null;

function getToken() {
  const token = localStorage.getItem("angostart_token");
  if (!token) throw new Error("Sem token de autenticação.");
  return token;
}

function getSocketBaseUrl() {
  return API_BASE.replace(/\/api\/v1\/?$/i, "");
}

export function connectChatSocket() {
  const token = getToken();
  if (socket?.connected) return socket;
  if (socket) socket.disconnect();

  socket = io(getSocketBaseUrl(), {
    transports: ["websocket"],
    auth: { token },
    withCredentials: true,
  });
  return socket;
}

export function getChatSocket() {
  return socket;
}

export function disconnectChatSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export async function getChatConversations() {
  const data = await requestJson(`${API_BASE}/chat/conversations`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return data.conversations || [];
}

export async function getChatMessages(withUserId) {
  const data = await requestJson(`${API_BASE}/chat/messages/${encodeURIComponent(withUserId)}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return data.messages || [];
}

export async function getCallHistory(withUserId) {
  const data = await requestJson(`${API_BASE}/chat/calls/${encodeURIComponent(withUserId)}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return data.calls || [];
}

export async function sendChatMessageHttp(receiverId, message) {
  const data = await requestJson(`${API_BASE}/chat/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ receiverId, message }),
  });
  return data.message || null;
}

export async function sendBroadcastMessageHttp(message) {
  const data = await requestJson(`${API_BASE}/chat/broadcast`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ message }),
  });
  return data.totalSent || 0;
}

export async function getOnlineUsers() {
  const data = await requestJson(`${API_BASE}/chat/online`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return data.onlineUserIds || [];
}

export async function getAgoraToken(channelName, callType = "video") {
  const data = await requestJson(`${API_BASE}/agora/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ channelName, callType }),
  });
  return {
    token: data.token,
    appId: data.appId,
    uid: data.uid,
    expiresAt: data.expiresAt,
    channelName: data.channelName,
    callType: data.callType,
  };
}
