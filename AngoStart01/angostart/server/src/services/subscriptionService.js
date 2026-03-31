import { z } from "zod";
import { findSubscriptionByUserId, upsertSubscriptionByUserId } from "../models/subscriptionModel.js";

const plansCatalog = [
  {
    code: "free",
    name: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    features: ["idea_submit", "marketplace_basic"],
  },
  {
    code: "pro",
    name: "Pro",
    priceMonthly: 15000,
    priceYearly: 150000,
    features: ["idea_submit", "marketplace_basic", "dynamic_questionnaire", "viability_analysis", "strategy_checklist"],
  },
  {
    code: "premium",
    name: "Premium",
    priceMonthly: 35000,
    priceYearly: 350000,
    features: [
      "idea_submit",
      "marketplace_basic",
      "dynamic_questionnaire",
      "viability_analysis",
      "strategy_checklist",
      "legal_company_guide",
      "priority_support",
    ],
  },
];

const planCodes = plansCatalog.map((p) => p.code);

const changePlanSchema = z.object({
  planCode: z.enum(planCodes),
  billingCycle: z.enum(["monthly", "yearly"]).optional().default("monthly"),
});

function fallbackFreeSubscription(userId) {
  return {
    id: null,
    user_id: userId,
    plan_code: "free",
    billing_cycle: "monthly",
    status: "active",
    started_at: null,
    expires_at: null,
    updated_at: null,
  };
}

function normalizeSubscription(sub) {
  const plan = plansCatalog.find((p) => p.code === sub.plan_code) || plansCatalog[0];
  return {
    planCode: sub.plan_code,
    billingCycle: sub.billing_cycle,
    status: sub.status,
    startedAt: sub.started_at,
    expiresAt: sub.expires_at,
    plan,
  };
}

export async function listPlans() {
  return plansCatalog;
}

export async function getCurrentSubscription(user) {
  const userId = Number(user.sub);
  const subscription = (await findSubscriptionByUserId(userId)) || fallbackFreeSubscription(userId);
  return normalizeSubscription(subscription);
}

export async function changeSubscriptionPlan(user, payload) {
  const data = changePlanSchema.parse(payload);
  const updated = await upsertSubscriptionByUserId({
    userId: Number(user.sub),
    planCode: data.planCode,
    billingCycle: data.billingCycle,
    status: "active",
    expiresAt: null,
  });
  return normalizeSubscription(updated);
}

export async function userHasFeature(userId, featureKey) {
  const sub = (await findSubscriptionByUserId(Number(userId))) || fallbackFreeSubscription(Number(userId));
  const plan = plansCatalog.find((p) => p.code === sub.plan_code) || plansCatalog[0];
  return plan.features.includes(featureKey);
}
