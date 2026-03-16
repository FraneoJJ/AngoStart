import app from "./app.js";
import { env } from "./config/env.js";
import { initDb } from "./config/db.js";
import http from "node:http";
import { initSocket } from "./realtime/socketServer.js";

async function bootstrap() {
  try {
    await initDb();
    const server = http.createServer(app);
    initSocket(server);
    server.listen(env.PORT, () => {
      console.log(`API rodando em http://localhost:${env.PORT} (HTTP + WebSocket)`);
    });
  } catch (err) {
    const details = err?.message || err?.code || JSON.stringify(err);
    console.error("Falha ao iniciar API:", details);
    if (err?.code) console.error("Código:", err.code);
    process.exit(1);
  }
}

bootstrap();
