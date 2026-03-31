import { verifyAccessToken } from "../utils/jwt.js";

export function requireAuth(req, _res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next({ status: 401, message: "Token ausente ou inválido." });
  }

  const token = header.slice(7);
  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    return next();
  } catch {
    return next({ status: 401, message: "Token expirado ou inválido." });
  }
}

export function requireRole(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user?.role) {
      return next({ status: 403, message: "Acesso negado." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next({ status: 403, message: "Role sem permissão para este recurso." });
    }

    return next();
  };
}
