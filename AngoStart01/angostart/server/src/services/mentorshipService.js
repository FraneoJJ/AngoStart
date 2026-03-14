import { z } from "zod";
import {
  createMentorshipRequest,
  findMentorshipRequestById,
  listMentorshipRequestsByEntrepreneur,
  listMentorshipRequestsForMentor,
  updateMentorshipRequestByMentor,
} from "../models/mentorshipModel.js";

const createRequestSchema = z.object({
  mentorId: z.coerce.number().int().positive(),
  ideaId: z.coerce.number().int().positive().optional(),
  topic: z.string().min(3).max(180),
  sessionType: z.enum(["online", "presencial"]).default("online"),
  preferredDatetime: z.string().min(10),
  durationMinutes: z.coerce.number().int().min(30).max(180).default(60),
  paymentMethod: z.enum(["multicaixa", "transferencia", "unitel-money", "afrimoney"]),
  priceKz: z.coerce.number().min(0).default(0),
  entrepreneurNotes: z.string().max(5000).optional().default(""),
});

const mentorUpdateSchema = z.object({
  status: z.enum(["accepted", "rejected", "completed"]),
  mentorNotes: z.string().max(5000).optional().default(""),
  scheduledFor: z.string().optional().default(""),
});

function toSqlDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

function normalizeRequest(row) {
  return {
    id: Number(row.id),
    entrepreneurUserId: Number(row.entrepreneur_user_id),
    mentorUserId: Number(row.mentor_user_id),
    ideaId: row.idea_id ? Number(row.idea_id) : null,
    topic: row.topic,
    sessionType: row.session_type,
    preferredDatetime: row.preferred_datetime,
    durationMinutes: Number(row.duration_minutes || 0),
    paymentMethod: row.payment_method,
    priceKz: Number(row.price_kz || 0),
    status: row.status,
    entrepreneurNotes: row.entrepreneur_notes || "",
    mentorNotes: row.mentor_notes || "",
    mentorResponseAt: row.mentor_response_at || null,
    scheduledFor: row.scheduled_for || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    entrepreneur: row.entrepreneur_name
      ? {
          name: row.entrepreneur_name,
          email: row.entrepreneur_email || "",
          businessName: row.entrepreneur_business_name || "",
          businessSector: row.entrepreneur_business_sector || "",
        }
      : null,
    mentor: row.mentor_name
      ? {
          name: row.mentor_name,
          email: row.mentor_email || "",
        }
      : null,
    ideaTitle: row.idea_title || "",
  };
}

export async function createMentorshipRequestForEntrepreneur(authUser, payload) {
  if (authUser?.role !== "empreendedor") {
    throw { status: 403, message: "Apenas empreendedores podem criar solicitações de mentoria." };
  }
  const parsed = createRequestSchema.parse(payload || {});
  const preferredDatetime = toSqlDateTime(parsed.preferredDatetime);
  if (!preferredDatetime) {
    throw { status: 400, message: "Data e hora preferencial inválida." };
  }
  const id = await createMentorshipRequest({
    entrepreneurUserId: Number(authUser.sub),
    mentorUserId: parsed.mentorId,
    ideaId: parsed.ideaId || null,
    topic: parsed.topic,
    sessionType: parsed.sessionType,
    preferredDatetime,
    durationMinutes: parsed.durationMinutes,
    paymentMethod: parsed.paymentMethod,
    priceKz: parsed.priceKz,
    entrepreneurNotes: parsed.entrepreneurNotes || "",
    scheduledFor: preferredDatetime,
  });
  const created = await findMentorshipRequestById(id);
  return created ? normalizeRequest(created) : { id };
}

export async function listMentorRequests(authUser) {
  if (authUser?.role !== "mentor") {
    throw { status: 403, message: "Apenas mentores podem consultar estas solicitações." };
  }
  const rows = await listMentorshipRequestsForMentor(Number(authUser.sub));
  return rows.map(normalizeRequest);
}

export async function listEntrepreneurRequests(authUser) {
  if (authUser?.role !== "empreendedor") {
    throw { status: 403, message: "Apenas empreendedores podem consultar suas solicitações." };
  }
  const rows = await listMentorshipRequestsByEntrepreneur(Number(authUser.sub));
  return rows.map(normalizeRequest);
}

export async function updateMentorRequest(authUser, requestId, payload) {
  if (authUser?.role !== "mentor") {
    throw { status: 403, message: "Apenas mentores podem atualizar solicitações." };
  }
  const parsed = mentorUpdateSchema.parse(payload || {});
  const scheduledFor = parsed.scheduledFor ? toSqlDateTime(parsed.scheduledFor) : null;
  if (parsed.status === "accepted" && !scheduledFor) {
    throw { status: 400, message: "Para aceitar, informe a data/hora confirmada da sessão." };
  }
  const affected = await updateMentorshipRequestByMentor(Number(requestId), Number(authUser.sub), {
    status: parsed.status,
    mentorNotes: parsed.mentorNotes || "",
    scheduledFor,
  });
  if (!affected) {
    throw { status: 404, message: "Solicitação não encontrada para este mentor." };
  }
  const updated = await findMentorshipRequestById(Number(requestId));
  return updated ? normalizeRequest(updated) : null;
}
