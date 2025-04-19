const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const checklistRoutes = require("./routes/checklistRoutes");
const cors = require("cors");
const logger = require("./utils/logger");
require("dotenv").config();

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Test route to verify API is working
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running' });
});

// Connect to MongoDB
connectDB().catch((error) => {
  logger.error("MongoDB Connection Failed", error.message);
  process.exit(1);
});

// Log loaded routes
logger.info("API Routes loaded:");
logger.info("- /api/auth (Authentication)");
logger.info("- /api/checklist (Checklist)");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/checklist", checklistRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.success(`Server running on port ${PORT}`);
});