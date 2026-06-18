"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
// Load environment variables first
dotenv_1.default.config();
// Connect to MongoDB
(0, db_1.default)();
const app = (0, express_1.default)();
// ============================================================
// MIDDLEWARE
// ============================================================
// CORS — allows frontend to talk to backend
app.use((0, cors_1.default)({
    origin: [
        process.env.CLIENT_URL || "http://localhost:5173",
        "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// Parse JSON
app.use(express_1.default.json());
// Parse form data
app.use(express_1.default.urlencoded({ extended: true }));
// Handle file uploads — for property images
app.use((0, express_fileupload_1.default)({
    useTempFiles: false,
    limits: { fileSize: 10 * 1024 * 1024 }, //10 mb per file
    abortOnLimit: true
}));
// ============================================================
// ROUTES
// ============================================================
app.use("/api/tasks", taskRoutes_1.default);
// Health check — to confirm server nis running
app.get("/api/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Personal Task  API is running",
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
exports.default = app;
