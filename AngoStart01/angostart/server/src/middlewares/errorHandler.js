export function notFoundHandler(_req, _res, next) {
  next({ status: 404, message: "Rota não encontrada." });
}

export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  const message = err.message || "Erro interno do servidor.";

  if (status >= 500) {
    console.error("[API ERROR]", err);
  }

  res.status(status).json({
    success: false,
    message,
  });
}
