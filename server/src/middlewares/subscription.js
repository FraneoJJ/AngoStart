import { userHasFeature } from "../services/subscriptionService.js";

export function requirePlanFeature(featureKey) {
  return async (req, _res, next) => {
    try {
      const userId = Number(req.user?.sub);
      if (!userId) {
        return next({ status: 401, message: "Autenticação obrigatória para este recurso." });
      }

      const allowed = await userHasFeature(userId, featureKey);
      if (!allowed) {
        return next({
          status: 403,
          message: "Seu plano atual não inclui este recurso. Atualize para continuar.",
        });
      }
      return next();
    } catch (err) {
      return next(err);
    }
  };
}
