import { z } from "zod";
import {
  findMessageById,
  insertMessage,
  listAllUserIdsExcept,
  listConversationUsersForUser,
  listMessagesBetweenUsers,
  markMessagesAsRead,
} from "../models/chatModel.js";

const sendMessageSchema = z.object({
  receiverId: z.coerce.number().int().positive(),
  message: z.string().trim().min(1).max(4000),
});

const sendBroadcastSchema = z.object({
  message: z.string().trim().min(1).max(4000),
});

function normalizeMessage(row) {
  return {
    id: Number(row.id),
    senderId: Number(row.sender_id),
    receiverId: Number(row.receiver_id),
    message: row.message || "",
    timestamp: row.timestamp,
    read: Number(row.lida || 0) === 1,
  };
}

function normalizeConversation(row) {
  return {
    userId: Number(row.id),
    name: row.name || "",
    email: row.email || "",
    role: row.role || "",
    avatarUrl: row.avatar_url || null,
    lastMessage: row.last_message || "",
    lastMessageAt: row.last_message_at || null,
  };
}

export async function sendChatMessage(authUser, payload) {
  const senderId = Number(authUser?.sub || 0);
  if (!senderId) throw { status: 401, message: "Utilizador não autenticado." };

  const parsed = sendMessageSchema.parse(payload || {});
  if (parsed.receiverId === senderId) {
    throw { status: 400, message: "Não é possível enviar mensagem para si mesmo." };
  }

  const insertedId = await insertMessage({
    senderId,
    receiverId: parsed.receiverId,
    message: parsed.message,
  });
  const row = await findMessageById(insertedId);
  return row ? normalizeMessage(row) : null;
}

export async function getConversation(authUser, withUserId) {
  const userId = Number(authUser?.sub || 0);
  const otherId = Number(withUserId || 0);
  if (!userId) throw { status: 401, message: "Utilizador não autenticado." };
  if (!otherId) throw { status: 400, message: "ID de conversa inválido." };

  const rows = await listMessagesBetweenUsers(userId, otherId, 300);
  await markMessagesAsRead(userId, otherId);
  return rows.map(normalizeMessage);
}

export async function listConversations(authUser) {
  const userId = Number(authUser?.sub || 0);
  if (!userId) throw { status: 401, message: "Utilizador não autenticado." };
  const rows = await listConversationUsersForUser(userId);
  return rows.map(normalizeConversation);
}

export async function sendBroadcastMessage(authUser, payload) {
  const senderId = Number(authUser?.sub || 0);
  if (!senderId) throw { status: 401, message: "Utilizador não autenticado." };
  if (authUser?.role !== "admin") throw { status: 403, message: "Apenas administradores podem enviar comunicado geral." };
  if ((authUser?.adminCategory || "primary") !== "primary") {
    throw { status: 403, message: "Apenas administrador principal pode enviar comunicado geral." };
  }

  const parsed = sendBroadcastSchema.parse(payload || {});
  const targetIds = await listAllUserIdsExcept(senderId);
  if (targetIds.length === 0) return { totalSent: 0 };

  for (const receiverId of targetIds) {
    await insertMessage({
      senderId,
      receiverId,
      message: parsed.message,
    });
  }
  return { totalSent: targetIds.length };
}
