import { z } from "zod";
import { createViabilityReport, findLatestViabilityReportByIdeaId } from "../models/viabilityModel.js";
import { syncIdeaApprovalByScore } from "../models/ideaModel.js";
import { env } from "../config/env.js";
import { generateJsonWithGemini } from "./googleAiService.js";

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

function toNumber(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function formatAoa(value) {
  return new Intl.NumberFormat("pt-PT").format(Math.round(toNumber(value, 0)));
}

function computeFinancialEstimate(idea, questionnaireAnswers) {
  const capital = Math.max(0, toNumber(idea.initialCapital, 0));
  const ticket = Math.max(0, toNumber(questionnaireAnswers?.ticket_medio, 0));
  const pricingGuess = ticket > 0 ? ticket : Math.max(1500, Math.round(capital * 0.06));
  const estimatedClientsMonth = Math.max(8, Math.round(8 + capital / 40000));
  const estimatedRevenueMonth = Math.round(pricingGuess * estimatedClientsMonth);
  const estimatedCostMonth = Math.round(Math.max(capital * 0.12, estimatedRevenueMonth * 0.58));
  const estimatedProfitMonth = Math.round(estimatedRevenueMonth - estimatedCostMonth);
  const breakEvenMonths =
    estimatedProfitMonth > 0 ? Math.max(1, Math.ceil(capital / estimatedProfitMonth)) : null;
  const projection12M = Math.round(estimatedProfitMonth * 12);

  return {
    estimatedRevenueMonth,
    estimatedCostMonth,
    estimatedProfitMonth,
    breakEvenMonths,
    projection12M,
  };
}

function computeViabilityHeuristic(data) {
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
  const financial = computeFinancialEstimate(idea, questionnaireAnswers);
  const identifiedRisks = [];
  const factorScores = {
    problemaMercado: hasRelevantText(idea.problem, 30) ? 80 : 45,
    diferencial: hasRelevantText(idea.differentialText, 30) ? 78 : 42,
    publicoAlvo: hasRelevantText(idea.targetAudience, 20) ? 76 : 48,
    execucao: questionnaireAnswers && Object.keys(questionnaireAnswers).length >= 3 ? 72 : 52,
    financeiro: financial.estimatedProfitMonth > 0 ? 70 : 40,
  };

  if (!hasRelevantText(idea.problem, 30)) identifiedRisks.push("Definição insuficiente da dor do cliente.");
  if (!hasRelevantText(idea.differentialText, 30)) identifiedRisks.push("Diferencial competitivo ainda frágil.");
  if ((idea.city || "").trim().length < 2) identifiedRisks.push("Mercado geográfico inicial pouco definido.");
  if (financial.estimatedProfitMonth <= 0) identifiedRisks.push("Margem mensal projetada negativa no cenário base.");
  if (!identifiedRisks.length) {
    identifiedRisks.push("Sem riscos críticos imediatos, manter monitoramento de aquisição e custos.");
  }
  const recommendedActions = adjustments.length
    ? adjustments.slice(0, 4)
    : [
        "Validar proposta com clientes reais em ciclos curtos.",
        "Acompanhar CAC, taxa de conversão e margem mensal.",
      ];

  return {
    viabilityStatus,
    score,
    strengths,
    weaknesses,
    adjustments,
    summary,
    identifiedRisks,
    financialAnalysis: `Receita mensal estimada em ${formatAoa(
      financial.estimatedRevenueMonth
    )} AOA, custos em ${formatAoa(financial.estimatedCostMonth)} AOA e lucro em ${formatAoa(
      financial.estimatedProfitMonth
    )} AOA.`,
    financialProjection:
      financial.breakEvenMonths != null
        ? `Com este cenário, o break-even pode ocorrer em cerca de ${financial.breakEvenMonths} meses e a projeção de lucro em 12 meses é de ${formatAoa(
            financial.projection12M
          )} AOA.`
        : "No cenário atual, a ideia não atinge break-even; é necessário rever pricing, custos e aquisição.",
    recommendedActions,
    nextRecommendedStep:
      viabilityStatus === "viavel"
        ? "Executar validação com clientes reais nas próximas 2 semanas e medir conversão inicial."
        : "Refinar proposta de valor e estrutura de custos antes da próxima rodada de validação.",
    factorScores,
  };
}

function buildGeminiPrompt(data) {
  const payload = {
    idea: data.idea,
    questionnaireAnswers: data.questionnaireAnswers || {},
  };

  return `
Você é um analista de viabilidade de negócios em Angola.
Analise a ideia abaixo e responda SOMENTE JSON válido com este formato:
{
  "viabilityStatus": "viavel" | "inviavel",
  "score": number (0-100),
  "strengths": string[],
  "weaknesses": string[],
  "adjustments": string[],
  "summary": string,
  "identifiedRisks": string[],
  "financialAnalysis": string,
  "financialProjection": string,
  "recommendedActions": string[],
  "nextRecommendedStep": string,
  "factorScores": {
    "problemaMercado": number (0-100),
    "diferencial": number (0-100),
    "publicoAlvo": number (0-100),
    "execucao": number (0-100),
    "financeiro": number (0-100)
  }
}

Regras:
- Seja objetivo e prático.
- Considere mercado local, clareza de problema, diferencial, público-alvo, capital e execução.
- score deve estar entre 0 e 100.
- "strengths", "weaknesses", "adjustments", "identifiedRisks" e "recommendedActions" devem ter entre 2 e 5 itens cada.
- "summary" em 1 frase curta.
- "financialAnalysis" e "financialProjection" devem ser objetivas e orientadas a números.
- "nextRecommendedStep" com ação prática imediata (1 frase).
- Não inclua markdown nem texto fora do JSON.

Dados:
${JSON.stringify(payload, null, 2)}
`.trim();
}

function normalizeAiReport(raw, fallback) {
  const viabilityStatus = raw?.viabilityStatus === "viavel" ? "viavel" : "inviavel";
  const score = Math.max(0, Math.min(100, Number(raw?.score || 0)));
  const strengths = Array.isArray(raw?.strengths) ? raw.strengths.filter(Boolean).slice(0, 5) : [];
  const weaknesses = Array.isArray(raw?.weaknesses) ? raw.weaknesses.filter(Boolean).slice(0, 5) : [];
  const adjustments = Array.isArray(raw?.adjustments) ? raw.adjustments.filter(Boolean).slice(0, 5) : [];
  const summary = String(raw?.summary || "").trim();
  const identifiedRisks = Array.isArray(raw?.identifiedRisks)
    ? raw.identifiedRisks.filter(Boolean).slice(0, 5)
    : [];
  const financialAnalysis = String(raw?.financialAnalysis || "").trim();
  const financialProjection = String(raw?.financialProjection || "").trim();
  const recommendedActions = Array.isArray(raw?.recommendedActions)
    ? raw.recommendedActions.filter(Boolean).slice(0, 5)
    : [];
  const nextRecommendedStep = String(raw?.nextRecommendedStep || "").trim();
  const factorScoresRaw = raw?.factorScores && typeof raw.factorScores === "object" ? raw.factorScores : {};
  const factorScores = {
    problemaMercado: Math.max(0, Math.min(100, toNumber(factorScoresRaw.problemaMercado, 0))),
    diferencial: Math.max(0, Math.min(100, toNumber(factorScoresRaw.diferencial, 0))),
    publicoAlvo: Math.max(0, Math.min(100, toNumber(factorScoresRaw.publicoAlvo, 0))),
    execucao: Math.max(0, Math.min(100, toNumber(factorScoresRaw.execucao, 0))),
    financeiro: Math.max(0, Math.min(100, toNumber(factorScoresRaw.financeiro, 0))),
  };

  if (
    !strengths.length ||
    !weaknesses.length ||
    !adjustments.length ||
    !summary ||
    !financialAnalysis ||
    !financialProjection ||
    !recommendedActions.length ||
    !nextRecommendedStep
  ) {
    return fallback;
  }

  return {
    viabilityStatus,
    score,
    strengths,
    weaknesses,
    adjustments,
    summary,
    identifiedRisks: identifiedRisks.length ? identifiedRisks : fallback.identifiedRisks,
    financialAnalysis,
    financialProjection,
    recommendedActions,
    nextRecommendedStep,
    factorScores,
  };
}

export async function analyzeViability(payload) {
  const data = analyzeSchema.parse(payload);
  const fallbackReport = computeViabilityHeuristic(data);

  let report = fallbackReport;
  let analysisSource = "fallback_local";
  let analysisNote = "Análise local aplicada.";
  try {
    const prompt = buildGeminiPrompt(data);
    const { data: aiRaw, error: aiError } = await generateJsonWithGemini(prompt, { temperature: 0.2 });
    if (aiRaw) {
      report = normalizeAiReport(aiRaw, fallbackReport);
      analysisSource = "groq_cloud";
      analysisNote = `Análise gerada pelo Groq Cloud (${env.GROQ_MODEL || "llama-3.3-70b-versatile"}).`;
    } else if (aiError) {
      analysisSource = "fallback_local";
      analysisNote = `Fallback local: ${aiError}`;
    }
  } catch {
    // Se API externa falhar, mantém fallback heurístico.
    report = fallbackReport;
    analysisSource = "fallback_local";
    analysisNote = "Fallback local: falha inesperada ao chamar Groq Cloud.";
  }

  // Persistência best-effort: se tabela não existir, retorna análise mesmo assim.
  try {
    const stored = await createViabilityReport({
      ideaId: data.ideaId,
      sessionId: data.questionnaireSessionId,
      ...report,
    });

    if (data.ideaId) {
      try {
        await syncIdeaApprovalByScore(Number(data.ideaId), Number(report.score || 0));
      } catch {
        // Não bloquear a análise se falhar atualização de governança.
      }
    }

    if (stored) {
      return {
        id: stored.id,
        ...report,
        analysisSource,
        analysisNote,
      };
    }
  } catch {
    // sem throw para não bloquear UX.
  }

  return {
    ...report,
    analysisSource,
    analysisNote,
  };
}

export async function getLatestViabilityReportByIdeaId(ideaId) {
  const id = Number(ideaId);
  if (!id) throw { status: 400, message: "ID da ideia inválido." };
  const row = await findLatestViabilityReportByIdeaId(id);
  if (!row) throw { status: 404, message: "Relatório de viabilidade ainda não encontrado para esta ideia." };

  const parseArray = (raw) => {
    try {
      const arr = JSON.parse(raw || "[]");
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  };

  return {
    id: row.id,
    ideaId: row.idea_id,
    questionnaireSessionId: row.session_id,
    viabilityStatus: row.viability_status,
    score: Number(row.score || 0),
    strengths: parseArray(row.strengths_json),
    weaknesses: parseArray(row.weaknesses_json),
    adjustments: parseArray(row.adjustments_json),
    summary: row.summary || "",
    createdAt: row.created_at,
  };
}
