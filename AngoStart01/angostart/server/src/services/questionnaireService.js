import { z } from "zod";
import {
  createQuestionnaireSession,
  findQuestionnaireSessionById,
  listAnswersBySessionId,
  upsertAnswers,
} from "../models/questionnaireModel.js";

function safeJsonDecode(value, fallback) {
  if (value == null) return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

const generateSchema = z.object({
  ideaId: z.number().int().positive().optional(),
  context: z.object({
    sector: z.string().optional().default("Geral"),
    city: z.string().optional().default(""),
    region: z.string().optional().default(""),
    initialCapital: z.number().optional().default(0),
    problem: z.string().optional().default(""),
    differentialText: z.string().optional().default(""),
    targetAudience: z.string().optional().default(""),
  }),
});

const answersSchema = z.object({
  answers: z.array(
    z.object({
      questionKey: z.string().min(2).max(120),
      answerText: z.string().max(5000).optional().default(""),
    })
  ).min(1),
});

function buildDynamicQuestions(context) {
  const base = [
    {
      key: "cliente_dor",
      label: "Qual é a principal dor do cliente que sua ideia resolve?",
      type: "textarea",
      required: true,
    },
    {
      key: "ticket_medio",
      label: "Qual ticket médio estimado por cliente (Kz)?",
      type: "number",
      required: true,
    },
    {
      key: "canal_aquisicao",
      label: "Qual será o principal canal de aquisição de clientes?",
      type: "select",
      options: ["Redes Sociais", "Parcerias", "Indicação", "Tráfego Pago", "Outro"],
      required: true,
    },
  ];

  const sector = (context.sector || "").toLowerCase();
  const sectorSpecific = [];

  if (sector.includes("fintech")) {
    sectorSpecific.push({
      key: "compliance_financeiro",
      label: "Que requisitos regulatórios financeiros você já mapeou?",
      type: "textarea",
      required: true,
    });
  } else if (sector.includes("agro")) {
    sectorSpecific.push({
      key: "sazonalidade",
      label: "Como a sazonalidade impacta receita e operação?",
      type: "textarea",
      required: true,
    });
  } else if (sector.includes("educ")) {
    sectorSpecific.push({
      key: "retencao_alunos",
      label: "Qual estratégia para retenção de alunos/usuários?",
      type: "textarea",
      required: true,
    });
  } else {
    sectorSpecific.push({
      key: "vantagem_competitiva",
      label: "Qual vantagem competitiva sustentável da sua ideia?",
      type: "textarea",
      required: true,
    });
  }

  if (context.initialCapital <= 50000) {
    sectorSpecific.push({
      key: "estrategia_bootstrap",
      label: "Como você pretende validar MVP com baixo capital?",
      type: "textarea",
      required: true,
    });
  } else {
    sectorSpecific.push({
      key: "alocacao_capital",
      label: "Como será a alocação percentual do capital inicial?",
      type: "textarea",
      required: true,
    });
  }

  if (context.region || context.city) {
    sectorSpecific.push({
      key: "estrategia_local",
      label: `Quais riscos locais para operar em ${context.city || context.region}?`,
      type: "textarea",
      required: true,
    });
  }

  return [...base, ...sectorSpecific];
}

export async function generateSession(user, payload) {
  const data = generateSchema.parse(payload);
  const questions = buildDynamicQuestions(data.context);

  const session = await createQuestionnaireSession({
    userId: user?.sub ? Number(user.sub) : null,
    ideaId: data.ideaId || null,
    context: data.context,
    questions,
  });

  return {
    id: session.id,
    context: safeJsonDecode(session.context_json, {}),
    questions: safeJsonDecode(session.questions_json, []),
  };
}

export async function saveSessionAnswers(sessionId, payload) {
  const parsed = answersSchema.parse(payload);
  const session = await findQuestionnaireSessionById(Number(sessionId));
  if (!session) {
    throw { status: 404, message: "Sessão de questionário não encontrada." };
  }

  await upsertAnswers(Number(sessionId), parsed.answers);
  const answers = await listAnswersBySessionId(Number(sessionId));
  return {
    sessionId: Number(sessionId),
    answers: answers.map((a) => ({
      questionKey: a.question_key,
      answerText: a.answer_text,
    })),
  };
}

export async function getSession(sessionId) {
  const session = await findQuestionnaireSessionById(Number(sessionId));
  if (!session) {
    throw { status: 404, message: "Sessão de questionário não encontrada." };
  }

  const answers = await listAnswersBySessionId(Number(sessionId));
  return {
    id: session.id,
    context: safeJsonDecode(session.context_json, {}),
    questions: safeJsonDecode(session.questions_json, []),
    answers: answers.map((a) => ({
      questionKey: a.question_key,
      answerText: a.answer_text,
    })),
  };
}
