export function notFoundHandler(_req, _res, next) {
  next({ status: 404, message: "Rota não encontrada." });
}

export function errorHandler(err, _req, res, _next) {
  let status = err.status || 500;
  let message = err.message || "Erro interno do servidor.";

  if (err?.code === "ER_NO_SUCH_TABLE") {
    status = 500;
    message = "Tabela ausente na base de dados. Execute/atualize o schema SQL.";
  } else if (err?.code === "ER_BAD_DB_ERROR") {
    status = 500;
    message = "Base de dados não encontrada. Verifique DB_NAME no ficheiro .env.";
  }

  if (status >= 500) {
    console.error("[API ERROR]", err);
  }

  res.status(status).json({
    success: false,
    message,
  });
}
