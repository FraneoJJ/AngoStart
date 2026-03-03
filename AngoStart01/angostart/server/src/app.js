import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import ideaRoutes from "./routes/ideaRoutes.js";
import questionnaireRoutes from "./routes/questionnaireRoutes.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { env } from "./config/env.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/v1/health", (_req, res) => {
  res.json({ success: true, message: "API AngoStart online." });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/ideas", ideaRoutes);
app.use("/api/v1/questionnaire", questionnaireRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
