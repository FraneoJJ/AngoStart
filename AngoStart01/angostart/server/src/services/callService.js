import { listCallsBetweenUsers, insertCallSession, updateCallStatus } from "../models/callModel.js";

function normalizeCall(row) {
  return {
    id: Number(row.id),
    channelName: row.channel_name,
    callerId: Number(row.caller_id),
    receiverId: Number(row.receiver_id),
    callType: row.call_type,
    status: row.status,
    createdAt: row.created_at,
    acceptedAt: row.accepted_at || null,
    endedAt: row.ended_at || null,
    endedByUserId: row.ended_by_user_id ? Number(row.ended_by_user_id) : null,
  };
}

export async function registerCallInvite({ channelName, callerId, receiverId, callType }) {
  await insertCallSession({ channelName, callerId, receiverId, callType: callType === "voice" ? "voice" : "video" });
}

export async function registerCallAccepted({ channelName }) {
  await updateCallStatus({ channelName, status: "accepted" });
}

export async function registerCallRejected({ channelName, endedByUserId }) {
  await updateCallStatus({ channelName, status: "rejected", endedByUserId });
}

export async function registerCallEnded({ channelName, endedByUserId }) {
  await updateCallStatus({ channelName, status: "ended", endedByUserId });
}

export async function getCallHistory(authUser, otherUserId) {
  const userId = Number(authUser?.sub || 0);
  const peerId = Number(otherUserId || 0);
  if (!userId) throw { status: 401, message: "Utilizador não autenticado." };
  if (!peerId) throw { status: 400, message: "ID do utilizador inválido." };
  const rows = await listCallsBetweenUsers(userId, peerId, 30);
  return rows.map(normalizeCall);
}
