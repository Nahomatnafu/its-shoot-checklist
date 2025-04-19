const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const checklistRoutes = require("./routes/checklistRoutes");
const cors = require("cors");
const logger = require("./utils/logger");
require("dotenv").config();

const app = express();

// Connect to MongoDB
connectDB().catch((error) => {
  logger.error("MongoDB Connection Failed", error.message);
  process.exit(1);
});

// Middleware
app.use(express.json());
app.use(cors());

// Log loaded routes
logger.info("API Routes loaded:");
logger.info("- /api/auth (Authentication)");
logger.info("- /api/checklist (Checklist)");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/checklist", checklistRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.success(`Server running on port ${PORT}`));
