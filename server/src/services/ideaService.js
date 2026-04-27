import { z } from "zod";
import {
  createIdea,
  findIdeaById,
  listIdeasByOwner,
  listMarketplaceIdeas,
  findLatestIdeaViabilityScore,
  updateIdeaApprovalStatusById,
  updateIdeaById,
  updateIdeaStatusById,
} from "../models/ideaModel.js";

const ideaSchema = z.object({
  title: z.string().min(2).max(180),
  description: z.string().min(10).max(5000),
  sector: z.string().min(2).max(120),
  city: z.string().min(2).max(120),
  address: z.string().max(255).optional().default(""),
  region: z.string().max(120).optional().default(""),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  initialCapital: z.number().min(0).optional().default(0),
  problem: z.string().max(3000).optional().default(""),
  differentialText: z.string().max(3000).optional().default(""),
  targetAudience: z.string().max(3000).optional().default(""),
  status: z.enum(["draft", "submitted", "analyzing", "active", "archived"]).optional().default("submitted"),
});

export async function createIdeaForUser(user, input) {
  const data = ideaSchema.parse(input);
  return createIdea({
    ...data,
    createdBy: Number(user.sub),
  });
}

export async function listMyIdeas(user) {
  return listIdeasByOwner(Number(user.sub));
}

export async function getIdeaById(id) {
  const idea = await findIdeaById(Number(id));
  if (!idea) {
    throw { status: 404, message: "Ideia não encontrada." };
  }
  return idea;
}

export async function updateIdea(user, id, input) {
  const current = await getIdeaById(id);
  const isOwner = Number(current.created_by) === Number(user.sub);
  const isAdmin = user.role === "admin";
  if (!isOwner && !isAdmin) {
    throw { status: 403, message: "Sem permissão para editar esta ideia." };
  }

  const data = ideaSchema.parse(input);
  return updateIdeaById(Number(id), data);
}

export async function marketplaceIdeas() {
  return listMarketplaceIdeas();
}

const statusSchema = z.object({
  status: z.enum(["submitted", "active", "archived"]),
});

const approvalSchema = z.object({
  approvalStatus: z.enum(["pending", "approved", "rejected"]),
});

export async function updateIdeaStatus(user, id, input) {
  const current = await getIdeaById(id);
  const isOwner = Number(current.created_by) === Number(user.sub);
  const isAdmin = user.role === "admin";
  if (!isOwner && !isAdmin) {
    throw { status: 403, message: "Sem permissão para alterar status desta ideia." };
  }

  const data = statusSchema.parse(input);
  const score = Number(await findLatestIdeaViabilityScore(Number(id)) || 0);
  if (!isAdmin && data.status === "active") {
    const approvalStatus = String(current?.approval_status || "pending");
    if (score >= 80) {
      // score alto já pode publicar, mesmo sem aprovação manual.
    } else if (approvalStatus !== "approved") {
      if (score >= 50) {
        throw { status: 403, message: "Esta ideia ainda precisa de aprovação manual da AngoStart antes da publicação." };
      }
      throw { status: 403, message: "Esta ideia foi rejeitada automaticamente por score baixo. Melhore e submeta novamente para nova análise." };
    } else if (score < 50) {
      // Exceção: admin aprovou manualmente score baixo.
    } else {
      throw { status: 403, message: "Esta ideia ainda precisa de aprovação manual da AngoStart antes da publicação." };
    }
  }
  return updateIdeaStatusById(Number(id), data.status);
}

export async function updateIdeaApproval(user, id, input) {
  const current = await getIdeaById(id);
  const isAdmin = user.role === "admin";
  if (!isAdmin) {
    throw { status: 403, message: "Apenas administradores podem aprovar/rejeitar ideias." };
  }
  const data = approvalSchema.parse(input);
  return updateIdeaApprovalStatusById(Number(id), data.approvalStatus);
}
