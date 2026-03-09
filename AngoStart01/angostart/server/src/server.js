import app from "./app.js";
import { env } from "./config/env.js";
import { initDb } from "./config/db.js";

async function bootstrap() {
  try {
    await initDb();
    app.listen(env.PORT, () => {
      console.log(`API rodando em http://localhost:${env.PORT}`);
    });
  } catch (err) {
    const details = err?.message || err?.code || JSON.stringify(err);
    console.error("Falha ao iniciar API:", details);
    if (err?.code) console.error("Código:", err.code);
    process.exit(1);
  }
}

bootstrap();
