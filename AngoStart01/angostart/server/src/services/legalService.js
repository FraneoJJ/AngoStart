import { z } from "zod";
import {
  createCompanyGuideRecord,
  getLatestCompanyGuideByUser,
  listLegalProgressByUser,
  upsertLegalStepProgress,
} from "../models/legalModel.js";

const flowByTrack = {
  empresa_angola: [
    { key: "empresa_nome", title: "Reserva/validação de nome", agency: "GUCE", description: "Validar disponibilidade do nome da empresa." },
    { key: "estatuto_social", title: "Elaboração de estatuto", agency: "Advogado/Consultor", description: "Definir objeto social, sócios e estrutura societária." },
    { key: "nif_empresa", title: "Obter NIF da empresa", agency: "AGT", description: "Registo fiscal inicial e emissão do NIF." },
    { key: "alvara_licenca", title: "Licença/Alvará setorial", agency: "Órgão setorial", description: "Obter licença conforme atividade econômica." },
    { key: "inss_registro", title: "Registo no INSS", agency: "INSS", description: "Formalizar obrigações sociais dos colaboradores." },
    { key: "conta_bancaria", title: "Abertura de conta bancária empresarial", agency: "Banco", description: "Conta para operações e comprovação financeira." },
  ],
  agt_regularizacao: [
    { key: "agt_cadastro", title: "Cadastro no portal AGT", agency: "AGT", description: "Criar e validar acesso no portal fiscal." },
    { key: "agt_enquadramento", title: "Enquadramento fiscal", agency: "AGT", description: "Definir regime fiscal aplicável ao negócio." },
    { key: "agt_declaracao_inicio", title: "Declaração de início de atividade", agency: "AGT", description: "Declarar início da operação oficialmente." },
    { key: "agt_obrigacoes_mensais", title: "Planeamento de obrigações mensais", agency: "AGT", description: "Configurar calendário de impostos e declarações." },
    { key: "agt_regularidade", title: "Certidão de regularidade fiscal", agency: "AGT", description: "Emitir certidão para contratos e financiamento." },
  ],
  propriedade_intelectual: [
    { key: "pi_busca_marca", title: "Busca de marca", agency: "IAPI", description: "Verificar disponibilidade da marca antes do depósito." },
    { key: "pi_deposito_marca", title: "Depósito da marca", agency: "IAPI", description: "Protocolar pedido de registro da marca." },
    { key: "pi_classe_nice", title: "Definição de classe NICE", agency: "IAPI", description: "Classificar corretamente produtos/serviços." },
    { key: "pi_contrato_confidencialidade", title: "NDA com parceiros", agency: "Jurídico", description: "Proteger informações estratégicas com terceiros." },
  ],
};

const updateSchema = z.object({
  stepKey: z.string().min(2).max(120),
  completed: z.boolean(),
  notes: z.string().max(3000).optional().default(""),
  ideaId: z.number().int().positive().optional(),
});

const companyGuideSchema = z.object({
  ideaId: z.number().int().positive().optional(),
  businessSector: z.string().max(120).optional().default(""),
  partnerCount: z.number().int().min(1).max(50).optional().default(1),
  estimatedMonthlyRevenue: z.number().min(0).optional().default(0),
  hasForeignPartner: z.boolean().optional().default(false),
  notes: z.string().max(2000).optional().default(""),
});

function buildCompanyGuide(data) {
  let recommendedType = "ENI";
  let estimatedOpeningDays = 10;
  let estimatedCostAoa = 120000;
  const reasons = [];

  if (data.partnerCount >= 2 || data.hasForeignPartner) {
    recommendedType = "LDA";
    estimatedOpeningDays = 18;
    estimatedCostAoa = 350000;
    reasons.push("Negócio com sócios/estrutura societária beneficia de LDA.");
  }

  if (data.partnerCount >= 5 || data.estimatedMonthlyRevenue >= 15000000) {
    recommendedType = "SA";
    estimatedOpeningDays = 30;
    estimatedCostAoa = 1200000;
    reasons.push("Escala operacional maior sugere estrutura de SA.");
  }

  if (recommendedType === "ENI") {
    reasons.push("Estrutura simples e rápida para iniciar operação.");
  }

  const requiredDocuments = [
    "Cópia do BI/Passaporte dos sócios",
    "NIF dos sócios e da entidade",
    "Certidão de admissibilidade do nome",
    "Estatutos/acto constitutivo",
    "Comprovativo de morada da sede",
    "Registo comercial e publicação",
    "Inscrição no INSS",
  ];

  const nextActions = [
    "Validar nome da empresa no GUCE.",
    "Preparar estatuto social com objeto e quotas.",
    "Concluir registo fiscal e enquadramento na AGT.",
    "Obter licenças específicas do setor antes de operar.",
  ];

  return {
    recommendedType,
    estimatedOpeningDays,
    estimatedCostAoa,
    reasons,
    requiredDocuments,
    nextActions,
    disclaimer: "Estimativas orientativas; confirme taxas e requisitos atualizados junto dos órgãos competentes.",
  };
}

export async function getLegalFlow(track = "empresa_angola") {
  return flowByTrack[track] || flowByTrack.empresa_angola;
}

export async function getLegalProgress(user, ideaIdRaw) {
  const ideaId = ideaIdRaw ? Number(ideaIdRaw) : undefined;
  const rows = await listLegalProgressByUser({ userId: Number(user.sub), ideaId });
  return rows.map((r) => ({
    stepKey: r.step_key,
    completed: !!r.completed,
    notes: r.notes || "",
    completedAt: r.completed_at,
    updatedAt: r.updated_at,
  }));
}

export async function updateLegalProgress(user, payload) {
  const data = updateSchema.parse(payload);
  await upsertLegalStepProgress({
    userId: Number(user.sub),
    ideaId: data.ideaId || null,
    stepKey: data.stepKey,
    completed: data.completed,
    notes: data.notes,
  });
  return { ok: true };
}

export async function generateCompanyGuide(user, payload) {
  const data = companyGuideSchema.parse(payload);
  const guide = buildCompanyGuide(data);
  const id = await createCompanyGuideRecord({
    userId: Number(user.sub),
    ideaId: data.ideaId || null,
    businessSector: data.businessSector,
    partnerCount: data.partnerCount,
    estimatedMonthlyRevenue: data.estimatedMonthlyRevenue,
    hasForeignPartner: data.hasForeignPartner,
    recommendedType: guide.recommendedType,
    estimatedOpeningDays: guide.estimatedOpeningDays,
    estimatedCostAoa: guide.estimatedCostAoa,
    notes: data.notes,
    resultJson: guide,
  });
  return { id, ...guide };
}

function safeJsonParse(raw, fallback) {
  if (!raw) return fallback;
  if (typeof raw === "object") return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export async function getLatestCompanyGuide(user) {
  const row = await getLatestCompanyGuideByUser({ userId: Number(user.sub) });
  if (!row) return null;
  const result = safeJsonParse(row.result_json, {});
  return {
    id: row.id,
    ideaId: row.idea_id,
    businessSector: row.business_sector || "",
    partnerCount: row.partner_count,
    estimatedMonthlyRevenue: Number(row.estimated_monthly_revenue || 0),
    hasForeignPartner: !!row.has_foreign_partner,
    recommendedType: row.recommended_type,
    estimatedOpeningDays: row.estimated_opening_days,
    estimatedCostAoa: Number(row.estimated_cost_aoa || 0),
    notes: row.notes || "",
    ...result,
  };
}
