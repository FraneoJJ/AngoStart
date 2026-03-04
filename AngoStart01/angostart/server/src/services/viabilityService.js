import { z } from "zod";
import { createViabilityReport } from "../models/viabilityModel.js";

const analyzeSchema = z.object({
  ideaId: z.number().int().positive().optional(),
  questionnaireSessionId: z.number().int().positive().optional(),
  idea: z.object({
    title: z.string().optional().default(""),
    description: z.string().optional().default(""),
    sector: z.string().optional().default(""),
    city: z.string().optional().default(""),
    region: z.string().optional().default(""),
    initialCapital: z.number().optional().default(0),
    problem: z.string().optional().default(""),
    differentialText: z.string().optional().default(""),
    targetAudience: z.string().optional().default(""),
  }),
  questionnaireAnswers: z.record(z.string(), z.string()).optional().default({}),
});

function hasRelevantText(v = "", min = 20) {
  return (v || "").trim().length >= min;
}

function normalizeText(v = "") {
  return String(v || "").trim().toLowerCase();
}

function answerCompletionScore(answers) {
  const entries = Object.entries(answers || {});
  if (!entries.length) return { score: 0, ratio: 0 };
  const filled = entries.filter(([, val]) => String(val || "").trim().length >= 3).length;
  const ratio = filled / entries.length;
  return { score: Math.round(ratio * 20), ratio };
}

function computeViability(data) {
  const { idea, questionnaireAnswers } = data;
  let score = 40;
  const strengths = [];
  const weaknesses = [];
  const adjustments = [];

  if (hasRelevantText(idea.problem, 30)) {
    score += 12;
    strengths.push("Problema de negócio está bem definido.");
  } else {
    score -= 10;
    weaknesses.push("Definição de problema ainda superficial.");
    adjustments.push("Aprofundar a dor do cliente com entrevistas locais.");
  }

  if (hasRelevantText(idea.differentialText, 30)) {
    score += 12;
    strengths.push("Diferencial competitivo identificado.");
  } else {
    score -= 10;
    weaknesses.push("Diferencial competitivo pouco claro.");
    adjustments.push("Definir proposta de valor única frente aos concorrentes.");
  }

  if (hasRelevantText(idea.targetAudience, 20)) {
    score += 8;
    strengths.push("Público-alvo mapeado.");
  } else {
    score -= 7;
    weaknesses.push("Público-alvo não segmentado.");
    adjustments.push("Segmentar cliente ideal por perfil, renda e localização.");
  }

  if (Number(idea.initialCapital || 0) > 0) {
    score += 6;
    strengths.push("Existe capital inicial para validação.");
  } else {
    score -= 8;
    weaknesses.push("Capital inicial indefinido.");
    adjustments.push("Definir orçamento mínimo de MVP e custos operacionais de 3 meses.");
  }

  if (idea.city || idea.region) {
    score += 6;
    strengths.push("Contexto geográfico de atuação informado.");
  } else {
    score -= 5;
    weaknesses.push("Localização de atuação não definida.");
    adjustments.push("Definir cidade/região inicial para melhor validação de mercado.");
  }

  const completion = answerCompletionScore(questionnaireAnswers);
  score += completion.score;
  if (completion.ratio >= 0.7) {
    strengths.push("Questionário estratégico preenchido de forma consistente.");
  } else if (completion.ratio > 0) {
    weaknesses.push("Questionário parcialmente preenchido.");
    adjustments.push("Completar perguntas-chave de aquisição, pricing e operação.");
  } else {
    weaknesses.push("Questionário estratégico não preenchido.");
    adjustments.push("Gerar e responder questionário dinâmico antes de escalar a ideia.");
  }

  const allAnswersText = normalizeText(Object.values(questionnaireAnswers || {}).join(" "));
  if (allAnswersText.includes("não sei") || allAnswersText.includes("nao sei")) {
    score -= 6;
    weaknesses.push("Incertezas estratégicas relevantes detectadas.");
    adjustments.push("Executar validação com clientes e mentores para reduzir incertezas.");
  }

  score = Math.max(0, Math.min(100, score));
  const viabilityStatus = score >= 65 ? "viavel" : "inviavel";
  const summary =
    viabilityStatus === "viavel"
      ? "A ideia apresenta boa base de viabilidade para avançar para validação de mercado."
      : "A ideia precisa de ajustes estratégicos antes de avançar para execução.";

  return { viabilityStatus, score, strengths, weaknesses, adjustments, summary };
}

export async function analyzeViability(payload) {
  const data = analyzeSchema.parse(payload);
  const report = computeViability(data);

  // Persistência best-effort: se tabela não existir, retorna análise mesmo assim.
  try {
    const stored = await createViabilityReport({
      ideaId: data.ideaId,
      sessionId: data.questionnaireSessionId,
      ...report,
    });

    if (stored) {
      return {
        id: stored.id,
        ...report,
      };
    }
  } catch {
    // sem throw para não bloquear UX.
  }

  return report;
}
