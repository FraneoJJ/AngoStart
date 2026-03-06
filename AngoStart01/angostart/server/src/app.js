import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import ideaRoutes from "./routes/ideaRoutes.js";
import questionnaireRoutes from "./routes/questionnaireRoutes.js";
import viabilityRoutes from "./routes/viabilityRoutes.js";
import legalRoutes from "./routes/legalRoutes.js";
import strategyRoutes from "./routes/strategyRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { env } from "./config/env.js";

const app = express();
const allowedOrigins = [
  env.FRONTEND_ORIGIN,
  "http://127.0.0.1:5173",
  "http://localhost:5173",
];

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      // Permite chamadas sem Origin (scripts/server-side) e localhost em modo dev.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (env.NODE_ENV !== "production" && /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origem CORS não permitida: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/v1/health", (_req, res) => {
  res.json({ success: true, message: "API AngoStart online." });
});

app.get("/api/v1", (_req, res) => {
  res.json({ success: true, message: "API AngoStart v1 online." });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/ideas", ideaRoutes);
app.use("/api/v1/questionnaire", questionnaireRoutes);
app.use("/api/v1/analysis", viabilityRoutes);
app.use("/api/v1/legal", legalRoutes);
app.use("/api/v1/strategy", strategyRoutes);
app.use("/api/v1/subscription", subscriptionRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
