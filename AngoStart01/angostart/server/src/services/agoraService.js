import { z } from "zod";
import agoraToken from "agora-token";
import { env } from "../config/env.js";

const { RtcTokenBuilder, RtcRole } = agoraToken;

const tokenSchema = z.object({
  channelName: z.string().trim().min(3).max(180),
  uid: z.coerce.number().int().min(1).optional(),
  callType: z.enum(["video", "voice"]).optional().default("video"),
});

export function generateRtcToken(authUser, payload) {
  const parsed = tokenSchema.parse(payload || {});
  const appId = String(env.AGORA_APP_ID || "").trim();
  const appCertificate = String(env.AGORA_APP_CERTIFICATE || "").trim();
  if (!appId || !appCertificate) {
    throw {
      status: 500,
      message: "Agora não configurado. Defina AGORA_APP_ID e AGORA_APP_CERTIFICATE no .env.",
    };
  }

  const uid = Number(parsed.uid || authUser?.sub || 0);
  if (!uid) {
    throw { status: 400, message: "UID inválido para geração do token Agora." };
  }

  const now = Math.floor(Date.now() / 1000);
  const ttl = Number(env.AGORA_TOKEN_TTL_SECONDS || 3600);
  const privilegeExpireTs = now + ttl;
  const role = RtcRole.PUBLISHER;
  const token = RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    parsed.channelName,
    uid,
    role,
    privilegeExpireTs
  );

  return {
    appId,
    token,
    channelName: parsed.channelName,
    uid,
    callType: parsed.callType,
    expiresAt: privilegeExpireTs,
  };
}
