import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import { connectDB } from "./src/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import confessionRoutes from "./src/routes/confessionRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

// Fix for reverse proxy (e.g., Render)
app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(helmet());

app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests. Please try again later." },
  })
);
app.use(express.json({ limit: "10kb", strict: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    message: "Confession website API is running!",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Confession API",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/confessions", confessionRoutes);
app.use("/api/admin", adminRoutes);

async function startServer() {
  if (!process.env.APP_URL || !process.env.API_URL || !process.env.CLIENT_URL) {
    throw new Error("APP_URL, API_URL, and CLIENT_URL are required");
  }

  if (
    isProduction &&
    (!process.env.JWT_SECRET ||
      process.env.JWT_SECRET.length < 32 ||
      !process.env.ADMIN_USERNAME ||
      !process.env.ADMIN_PASSWORD_HASH ||
      !process.env.GMAIL_USER ||
      !process.env.GMAIL_APP_PASSWORD ||
      !process.env.ADMIN_EMAIL)
  ) {
    throw new Error(
      "Production authentication and email secrets must be configured"
    );
  }

  for (const [name, value] of Object.entries({
    APP_URL: process.env.APP_URL,
    API_URL: process.env.API_URL,
    CLIENT_URL: process.env.CLIENT_URL,
  })) {
    let parsedUrl;

    try {
      parsedUrl = new URL(value);
    } catch {
      throw new Error(`${name} must be a valid URL`);
    }

    if (isProduction && parsedUrl.protocol !== "https:") {
      throw new Error(`${name} must use HTTPS in production`);
    }
  }

  await connectDB();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Server startup failed:", error.message);
  process.exit(1);
});