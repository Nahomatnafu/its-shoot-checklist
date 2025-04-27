const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const checklistRoutes = require("./routes/checklistRoutes");
const shootRoutes = require("./routes/shootRoutes");
const waiverRoutes = require("./routes/waiverRoutes");
const creditRoutes = require("./routes/creditRoutes");
const cors = require("cors");
const logger = require("./utils/logger");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
app.set("trust proxy", 1);

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});
app.use("/api/", limiter);

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "https://its-shoot-checklist.vercel.app",
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Origin not allowed:", origin);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  exposedHeaders: ["Authorization"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Parse incoming requests
app.use(express.json({ limit: "10mb" }));

// Cache control for static files
app.use(
  express.static("public", {
    maxAge: "1h",
    setHeaders: function (res, path) {
      if (path.endsWith(".jpg") || path.endsWith(".png")) {
        res.setHeader("Cache-Control", "public, max-age=3600");
      }
    },
  })
);

// Caching for checklist API
app.get("/api/checklist", (req, res) => {
  res.set("Cache-Control", "public, max-age=300");
});

// Mount routes with correct /api prefix
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/checklist", checklistRoutes);
app.use("/api/shoots", shootRoutes);
app.use("/api/waivers", waiverRoutes);
app.use("/api/credits", creditRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error(`${err.name}: ${err.message}`, err);
  res.status(err.status || 500).json({
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Promise Rejection:", err);
});

// Start server
const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.success(`🚀 Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
    });
  })
  .catch((err) => {
    logger.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  });
