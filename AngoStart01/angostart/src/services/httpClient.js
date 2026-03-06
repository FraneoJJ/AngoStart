export async function requestJson(url, options = {}) {
  let response;
  try {
    response = await fetch(url, options);
  } catch {
    throw new Error("Falha de conexão com a API. Verifique se a API está ligada e se o CORS permite o endereço do frontend.");
  }

  const contentType = response.headers.get("content-type") || "";
  let data = null;

  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      throw new Error("Resposta JSON inválida da API.");
    }
  } else {
    const text = await response.text();
    if (!response.ok) {
      throw new Error(text || `Erro HTTP ${response.status}`);
    }
    throw new Error("Resposta inesperada da API (não JSON).");
  }

  if (!response.ok || !data?.success) {
    throw new Error(data?.message || `Erro HTTP ${response.status}`);
  }

  return data;
}
