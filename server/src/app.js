import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import ideaRoutes from "./routes/ideaRoutes.js";
import ideaProgressRoutes from "./routes/ideaProgressRoutes.js";
import questionnaireRoutes from "./routes/questionnaireRoutes.js";
import viabilityRoutes from "./routes/viabilityRoutes.js";
import legalRoutes from "./routes/legalRoutes.js";
import strategyRoutes from "./routes/strategyRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import mentorshipRoutes from "./routes/mentorshipRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import agoraRoutes from "./routes/agoraRoutes.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { env } from "./config/env.js";

const app = express();
const allowedOrigins = new Set(
  [
    env.FRONTEND_ORIGIN,
    "https://franeojj.github.io",
    "http://127.0.0.1:5173",
    "http://localhost:5173",
  ]
    .filter(Boolean)
    .map((origin) => origin.replace(/\/$/, ""))
);

const corsOptions = {
  origin(origin, callback) {
    // Permite chamadas sem Origin (curl/server-to-server/health checks).
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/$/, "");
    if (allowedOrigins.has(normalizedOrigin)) return callback(null, true);

    if (env.NODE_ENV !== "production" && /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origem CORS não permitida: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(helmet());
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
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
app.use("/api/v1/idea-progress", ideaProgressRoutes);
app.use("/api/v1/questionnaire", questionnaireRoutes);
app.use("/api/v1/analysis", viabilityRoutes);
app.use("/api/v1/legal", legalRoutes);
app.use("/api/v1/strategy", strategyRoutes);
app.use("/api/v1/subscription", subscriptionRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/mentorship", mentorshipRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/agora", agoraRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
