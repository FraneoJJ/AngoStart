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
    console.error("Falha ao iniciar API:", err.message);
    process.exit(1);
  }
}

bootstrap();
