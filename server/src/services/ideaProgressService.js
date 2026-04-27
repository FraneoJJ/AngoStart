import { z } from "zod";
import { findIdeaById } from "../models/ideaModel.js";
import { createIdeaProgress, listIdeaProgressByIdea } from "../models/ideaProgressModel.js";

const ideaProgressSchema = z.object({
  ideaId: z.coerce.number().int().positive(),
  status: z.enum(["inicial", "validacao", "crescimento", "escala"]),
  progressPercentage: z.coerce.number().min(0).max(100),
  goalsCompleted: z.string().max(5000).optional().default(""),
  nextSteps: z.string().max(5000).optional().default(""),
  revenue: z.coerce.number().min(0).optional().default(0),
  expenses: z.coerce.number().min(0).optional().default(0),
  investment: z.coerce.number().min(0).optional().default(0),
  totalClients: z.coerce.number().int().min(0).optional().default(0),
  newClients: z.coerce.number().int().min(0).optional().default(0),
  lostClients: z.coerce.number().int().min(0).optional().default(0),
  customerFeedback: z.string().max(5000).optional().default(""),
  marketingCampaigns: z.string().max(5000).optional().default(""),
  marketingChannels: z.string().max(5000).optional().default(""),
  marketingResults: z.string().max(5000).optional().default(""),
  weeklySummary: z.string().max(5000).optional().default(""),
  challenges: z.string().max(5000).optional().default(""),
  learnings: z.string().max(5000).optional().default(""),
});

async function ensureUserCanAccessIdea(user, ideaId) {
  const idea = await findIdeaById(Number(ideaId));
  if (!idea) {
    throw { status: 404, message: "Ideia não encontrada." };
  }
  const isAdmin = user?.role === "admin";
  const isOwner = Number(idea.created_by) === Number(user?.sub);
  if (!isAdmin && !isOwner) {
    throw { status: 403, message: "Sem permissão para aceder ao progresso desta ideia." };
  }
}

export async function saveIdeaProgress(user, input) {
  const data = ideaProgressSchema.parse(input);
  await ensureUserCanAccessIdea(user, data.ideaId);

  return createIdeaProgress({
    ...data,
    userId: Number(user.sub),
  });
}

export async function getIdeaProgressByIdea(user, ideaId) {
  const parsedIdeaId = z.coerce.number().int().positive().parse(ideaId);
  await ensureUserCanAccessIdea(user, parsedIdeaId);
  return listIdeaProgressByIdea(parsedIdeaId);
}
