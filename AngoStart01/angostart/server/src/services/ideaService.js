import { z } from "zod";
import {
  createIdea,
  findIdeaById,
  listIdeasByOwner,
  listMarketplaceIdeas,
  updateIdeaById,
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
