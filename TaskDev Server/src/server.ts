import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import fileUpload from "express-fileupload";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes";
import authRoutes from "./routes/authRoutes";

// Load environment variables first
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ============================================================
// MIDDLEWARE
// ============================================================

// CORS — credentials: true is required for cookies to be sent
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      "http://localhost:5173",
    ],
    credentials: true, // allows cookies to be sent cross-origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse JSON
app.use(express.json());

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Parse cookies — required for httpOnly cookie auth
app.use(cookieParser());

// Handle file uploads
app.use(
  fileUpload({
    useTempFiles: false,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10mb per file
    abortOnLimit: true,
  })
);

// ============================================================
// ROUTES
// ============================================================
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "TaskDev API is running",
  });
});

// ============================================================
// START SERVER
// ============================================================
const PORT = process.env.PORT || 5200;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Frontend URL: ${process.env.CLIENT_URL}`);
});

export default app;