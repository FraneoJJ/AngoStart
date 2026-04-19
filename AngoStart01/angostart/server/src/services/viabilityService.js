import { z } from "zod";
import { createViabilityReport } from "../models/viabilityModel.js";
import { env } from "../config/env.js";
import { generateJsonWithAiProvider } from "./googleAiService.js";

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

function normalizeFreeText(v = "") {
  return String(v || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function forceKwanzaCurrency(text = "") {
  return String(text || "")
    .replace(/\$\s*/g, "Kz ")
    .replace(/\bUSD\b/gi, "Kz")
    .replace(/\bd[oó]lar(?:es)?\b/gi, "Kz")
    .replace(/\bUS\$\b/gi, "Kz");
}

const essentialCostBySector = [
  {
    keys: ["fintech", "tecnologia", "software", "telecom"],
    items: [
      { name: "Desenvolvimento inicial (MVP)", cost: 350000 },
      { name: "Infraestrutura cloud e segurança", cost: 180000 },
      { name: "Aquisição inicial de clientes", cost: 120000 },
    ],
  },
  {
    keys: ["agro", "pescas", "aquicultura"],
    items: [
      { name: "Equipamentos operacionais base", cost: 420000 },
      { name: "Insumos e logística inicial", cost: 250000 },
      { name: "Licenças e regularização", cost: 90000 },
    ],
  },
  {
    keys: ["saude", "educacao"],
    items: [
      { name: "Infraestrutura e materiais", cost: 280000 },
      { name: "Equipe técnica inicial", cost: 220000 },
      { name: "Compliance/regulação", cost: 110000 },
    ],
  },
  {
    keys: ["comercio", "retalho", "turismo", "hotelaria", "logistica", "transportes"],
    items: [
      { name: "Estoque/operação inicial", cost: 300000 },
      { name: "Ponto/estrutura e equipamentos", cost: 260000 },
      { name: "Marketing e aquisição", cost: 100000 },
    ],
  },
];

function getEssentialCostBenchmark(sectorRaw = "") {
  const sector = normalizeFreeText(sectorRaw);
  const selected =
    essentialCostBySector.find((group) => group.keys.some((k) => sector.includes(k))) ||
    {
      items: [
        { name: "Estrutura operacional mínima", cost: 250000 },
        { name: "Marketing inicial", cost: 90000 },
        { name: "Reserva de caixa inicial", cost: 120000 },
      ],
    };
  const requiredTotal = selected.items.reduce((acc, item) => acc + Number(item.cost || 0), 0);
  return { items: selected.items, requiredTotal };
}

function hasFinancialMovementData(questionnaireAnswers = {}) {
  const entries = Object.entries(questionnaireAnswers || {});
  if (!entries.length) return false;
  const movementSignals = [
    "receita",
    "fatur",
    "venda",
    "clientes_ativos",
    "clientes ativos",
    "lucro",
    "despesa",
    "custo mensal",
  ];
  return entries.some(([key, value]) => {
    const k = normalizeFreeText(key);
    const v = normalizeFreeText(value);
    const numeric = toNumber(String(value || "").replace(/[^\d.,-]/g, "").replace(",", "."), 0);
    return movementSignals.some((sig) => k.includes(sig) || v.includes(sig)) && numeric > 0;
  });
}

function computeAudienceFit(idea) {
  const problem = normalizeFreeText(idea.problem);
  const audience = normalizeFreeText(idea.targetAudience);
  if (!problem || !audience) {
    return {
      score: 35,
      suggestion:
        "Defina um público-alvo específico por perfil (idade, renda, contexto) diretamente ligado à dor principal.",
      lowFit: true,
    };
  }

  const buckets = [
    { keywords: ["estudante", "escola", "universidade", "curso", "aluno"], audience: ["estudante", "pais", "professor"] },
    { keywords: ["empresa", "negocio", "b2b", "gestao", "operacao"], audience: ["empresas", "pmes", "gestores"] },
    { keywords: ["saude", "clinica", "hospital", "paciente"], audience: ["pacientes", "familias", "clinicas"] },
    { keywords: ["agric", "producao rural", "fazenda"], audience: ["agricultores", "cooperativas", "distribuidores"] },
  ];

  const matchedBucket = buckets.find((b) => b.keywords.some((k) => problem.includes(k)));
  if (!matchedBucket) {
    return {
      score: 55,
      suggestion:
        "Valide se o público descrito tem a dor principal e capacidade de pagar pela solução.",
      lowFit: false,
    };
  }

  const aligned = matchedBucket.audience.some((a) => audience.includes(normalizeFreeText(a)));
  return aligned
    ? {
        score: 78,
        suggestion: "",
        lowFit: false,
      }
    : {
        score: 28,
        suggestion: `Público sugerido para este problema: ${matchedBucket.audience.join(", ")}.`,
        lowFit: true,
      };
}

function computeExecutionScore(questionnaireAnswers = {}) {
  const entries = Object.entries(questionnaireAnswers || {});
  if (!entries.length) {
    return { score: 25, isIdeaStage: true };
  }
  const blob = normalizeFreeText(entries.map(([k, v]) => `${k} ${v}`).join(" "));
  const ongoingSignals = ["clientes", "vendas", "faturamento", "receita", "operando", "equipa", "mvp em producao", "piloto ativo"];
  const hasOngoingSignals = ongoingSignals.some((s) => blob.includes(s));
  if (!hasOngoingSignals) {
    return { score: 28, isIdeaStage: true };
  }
  return { score: 62, isIdeaStage: false };
}

function computeFinancialEstimate(idea, questionnaireAnswers) {
  const capital = Math.max(0, toNumber(idea.initialCapital, 0));
  const benchmark = getEssentialCostBenchmark(idea.sector);
  const coverage = benchmark.requiredTotal > 0 ? capital / benchmark.requiredTotal : 0;
  const coverageScore = Math.max(0, Math.min(100, Math.round(coverage * 100)));
  const ticket = Math.max(0, toNumber(questionnaireAnswers?.ticket_medio, 0));
  const hasMovement = hasFinancialMovementData(questionnaireAnswers);
  const hasMinimumPricingData = ticket > 0;

  let estimatedRevenueMonth = 0;
  let estimatedCostMonth = 0;
  let estimatedProfitMonth = 0;
  let breakEvenMonths = null;
  let projection12M = null;

  if (hasMovement && hasMinimumPricingData) {
    const estimatedClientsMonth = Math.max(8, Math.round(8 + capital / 40000));
    estimatedRevenueMonth = Math.round(ticket * estimatedClientsMonth);
    estimatedCostMonth = Math.round(Math.max(capital * 0.12, estimatedRevenueMonth * 0.58));
    estimatedProfitMonth = Math.round(estimatedRevenueMonth - estimatedCostMonth);
    breakEvenMonths =
      estimatedProfitMonth > 0 ? Math.max(1, Math.ceil(capital / estimatedProfitMonth)) : null;
    projection12M = Math.round(estimatedProfitMonth * 12);
  }

  return {
    benchmarkItems: benchmark.items,
    requiredTotal: benchmark.requiredTotal,
    coverage,
    coverageScore,
    hasMovement,
    hasMinimumPricingData,
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
  const audienceFit = computeAudienceFit(idea);
  const execution = computeExecutionScore(questionnaireAnswers);
  const identifiedRisks = [];
  const factorScores = {
    problemaMercado: hasRelevantText(idea.problem, 30) ? 80 : 45,
    diferencial: hasRelevantText(idea.differentialText, 30) ? 78 : 42,
    publicoAlvo: audienceFit.score,
    execucao: execution.isIdeaStage ? Math.min(29, execution.score) : execution.score,
    financeiro: financial.coverageScore,
  };

  if (!hasRelevantText(idea.problem, 30)) identifiedRisks.push("Definição insuficiente da dor do cliente.");
  if (!hasRelevantText(idea.differentialText, 30)) identifiedRisks.push("Diferencial competitivo ainda frágil.");
  if ((idea.city || "").trim().length < 2) identifiedRisks.push("Mercado geográfico inicial pouco definido.");
  if (financial.coverage < 1) {
    identifiedRisks.push(
      `Capital abaixo do mínimo estimado para itens essenciais do setor (cobertura aproximada: ${Math.round(
        financial.coverage * 100
      )}%).`
    );
  }
  if (execution.isIdeaStage) {
    identifiedRisks.push("Negócio ainda em estágio de ideia, sem evidência de execução em andamento.");
  }
  if (!financial.hasMovement || !financial.hasMinimumPricingData) {
    identifiedRisks.push("Dados financeiros insuficientes para projeção confiável.");
  }
  if (audienceFit.lowFit) {
    identifiedRisks.push("Público-alvo atual pode não ser o mais aderente ao problema principal.");
  }
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
    financialAnalysis: `Itens essenciais estimados para ${idea.sector || "o setor"}: ${financial.benchmarkItems
      .map((i) => `${i.name} (${formatAoa(i.cost)} AOA)`)
      .join(", ")}. Total estimado: ${formatAoa(financial.requiredTotal)} AOA. Capital informado: ${formatAoa(
      idea.initialCapital || 0
    )} AOA. Score financeiro baseado na cobertura: ${factorScores.financeiro}/100.`,
    financialProjection:
      !financial.hasMovement || !financial.hasMinimumPricingData
        ? "Sem projeção financeira: faltam dados de movimentação financeira do negócio (receita/custos/vendas) e pricing mínimo."
        : financial.breakEvenMonths != null
          ? `Com os dados financeiros informados, o break-even pode ocorrer em cerca de ${financial.breakEvenMonths} meses e a projeção de lucro em 12 meses é de ${formatAoa(
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

function buildViabilityPrompt(data) {
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
- Use SEMPRE moeda local em Kz/AOA (nunca dólar/USD/$).
- "nextRecommendedStep" com ação prática imediata (1 frase).
- Se NÃO houver dados de movimentação financeira (receita/custos/vendas), "financialProjection" deve dizer explicitamente que não é possível projetar.
- Em "financialAnalysis", estime custos de itens essenciais do setor e compare com capital informado, incluindo score financeiro pela diferença/cobertura.
- Se público-alvo não parecer aderente ao problema principal, reduza score de "publicoAlvo" e inclua sugestão explícita de público-alvo melhor.
- Se for só ideia (sem evidência de operação em andamento), "execucao" deve ficar abaixo de 30.
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
  const financialAnalysis = forceKwanzaCurrency(String(raw?.financialAnalysis || "").trim());
  const financialProjection = forceKwanzaCurrency(String(raw?.financialProjection || "").trim());
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
  if (fallback?.factorScores?.execucao < 30) {
    factorScores.execucao = Math.min(29, factorScores.execucao);
  }

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
    // Mantém os blocos financeiros ancorados no cálculo interno do sistema
    // para evitar respostas genéricas/incoerentes da IA externa.
    financialAnalysis: fallback.financialAnalysis || financialAnalysis,
    financialProjection: fallback.financialProjection || financialProjection,
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
    const prompt = buildViabilityPrompt(data);
    const { data: aiRaw, error: aiError } = await generateJsonWithAiProvider(prompt, { temperature: 0.2 });
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
