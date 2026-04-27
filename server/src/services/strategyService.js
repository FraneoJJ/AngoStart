import { z } from "zod";
import { listStrategicProgressByUser, upsertStrategicStepProgress } from "../models/strategyModel.js";

const checklistByTrack = {
  validacao: [
    { key: "validar_problema_cliente", title: "Validar problema com clientes reais", description: "Realizar entrevistas curtas com potenciais clientes para confirmar dor e urgência." },
    { key: "definir_segmento_alvo", title: "Definir segmento de cliente prioritário", description: "Escolher nicho inicial com perfil claro e poder de compra." },
    { key: "testar_proposta_valor", title: "Testar proposta de valor", description: "Executar testes rápidos de mensagem/oferta para medir interesse real." },
    { key: "desenhar_mvp", title: "Desenhar MVP de baixo custo", description: "Listar funcionalidades mínimas para testar hipótese central." },
  ],
  operacao: [
    { key: "plano_financeiro_90dias", title: "Planeamento financeiro de 90 dias", description: "Mapear custos fixos, variáveis e necessidade de caixa inicial." },
    { key: "processo_vendas", title: "Estruturar processo comercial", description: "Definir funil de aquisição, canais e metas semanais de vendas." },
    { key: "kpis_iniciais", title: "Definir KPIs operacionais", description: "Selecionar métricas essenciais (conversão, retenção, ticket médio)." },
    { key: "rotina_execucao", title: "Estabelecer rotina de execução", description: "Criar cadência semanal com revisão de resultados e ajustes." },
  ],
  crescimento: [
    { key: "otimizar_aquisicao", title: "Otimizar canais de aquisição", description: "Escalar os canais com melhor CAC/ROI e reduzir desperdício." },
    { key: "fortalecer_retencao", title: "Fortalecer retenção e recompra", description: "Implementar ações de fidelização e melhoria de experiência." },
    { key: "parcerias_estrategicas", title: "Criar parcerias estratégicas", description: "Buscar parceiros locais para distribuição, confiança e escala." },
    { key: "planejar_expansao", title: "Planejar expansão geográfica", description: "Definir critérios para expandir para novas províncias/mercados." },
  ],
};

const checklistSchema = z.object({
  track: z.enum(["validacao", "operacao", "crescimento"]).optional().default("validacao"),
  context: z
    .object({
      sector: z.string().optional().default(""),
      city: z.string().optional().default(""),
      initialCapital: z.number().optional().default(0),
      viabilityScore: z.number().optional().default(0),
      hasMvp: z.boolean().optional().default(false),
    })
    .optional()
    .default({}),
});

const updateSchema = z.object({
  stepKey: z.string().min(2).max(120),
  completed: z.boolean(),
  notes: z.string().max(3000).optional().default(""),
  ideaId: z.number().int().positive().optional(),
});

function withPriorities(steps, context = {}) {
  return steps.map((step, idx) => {
    let priority = idx < 2 ? "alta" : "media";
    let whyNow = "Etapa recomendada para manter progresso saudável do negócio.";

    if (step.key === "plano_financeiro_90dias" && Number(context.initialCapital || 0) <= 0) {
      priority = "alta";
      whyNow = "Não há capital inicial definido. Esta etapa reduz risco de caixa.";
    }

    if (step.key === "desenhar_mvp" && !context.hasMvp) {
      priority = "alta";
      whyNow = "Sem MVP, a validação prática fica limitada. Esta etapa acelera aprendizagem.";
    }

    if (step.key === "validar_problema_cliente" && !context.city) {
      priority = "alta";
      whyNow = "Sem cidade definida, validar problema local ajuda a escolher o mercado inicial.";
    }

    if (Number(context.viabilityScore || 0) > 0 && Number(context.viabilityScore) < 65) {
      if (step.key === "testar_proposta_valor" || step.key === "definir_segmento_alvo") {
        priority = "alta";
        whyNow = "Pontuação de viabilidade baixa: focar ajuste de proposta e segmento.";
      }
    }

    return {
      ...step,
      priority,
      whyNow,
    };
  });
}

export async function getStrategicChecklist(payload = {}) {
  const data = checklistSchema.parse(payload);
  const base = checklistByTrack[data.track] || checklistByTrack.validacao;
  return withPriorities(base, data.context);
}

export async function getStrategicProgress(user, ideaIdRaw) {
  const ideaId = ideaIdRaw ? Number(ideaIdRaw) : undefined;
  const rows = await listStrategicProgressByUser({ userId: Number(user.sub), ideaId });
  return rows.map((r) => ({
    stepKey: r.step_key,
    completed: !!r.completed,
    notes: r.notes || "",
    completedAt: r.completed_at,
    updatedAt: r.updated_at,
  }));
}

export async function updateStrategicProgress(user, payload) {
  const data = updateSchema.parse(payload);
  await upsertStrategicStepProgress({
    userId: Number(user.sub),
    ideaId: data.ideaId || null,
    stepKey: data.stepKey,
    completed: data.completed,
    notes: data.notes,
  });
  return { ok: true };
}
