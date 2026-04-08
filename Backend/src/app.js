import express from "express";
import cors from "cors";
import morgan from "morgan";

// Route imports
import userRoutes from "./routes/userRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";

// Middleware imports
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

const allowedOrigins = [
  "https://regal-cendol-2be6f2.netlify.app/",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
  process.env.NETLIFY_URL,
].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser requests (like Postman/curl) and same-origin calls.
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS blocked for this origin"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ── Core Middleware ──────────────────────────────────────────────
app.use(cors(corsOptions)); // Enable Cross-Origin Resource Sharing
app.options("*", cors(corsOptions));
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies

// Request logger (only in development)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ── Health Check ─────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "🚀 API is running..." });
});

// ── API Routes ───────────────────────────────────────────────────
app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/conversations", conversationRoutes);

// ── Error Handling ───────────────────────────────────────────────
app.use(notFound); // 404 handler — must be after all valid routes
app.use(errorHandler); // Global error handler — must be last

export default app;
