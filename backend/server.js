const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const checklistRoutes = require("./routes/checklistRoutes");
const cors = require("cors");
const logger = require("./utils/logger");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
app.set("trust proxy", 1); // <-- Add this here


// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use("/api/", limiter);

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "https://its-shoot-checklist.vercel.app",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
}));

app.use(express.json({ limit: '10mb' }));

// Add cache control headers for static resources
app.use(express.static('public', {
  maxAge: '1h',
  setHeaders: function(res, path) {
    if (path.endsWith('.jpg') || path.endsWith('.png')) {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
  }
}));

// Add caching for API responses where appropriate
app.get("/api/checklist", (req, res) => {
  res.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
  // ... rest of your route handler
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);  
app.use("/api/checklist", checklistRoutes);


// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Error handling
app.use((err, req, res, next) => {
  logger.error(`${err.name}: ${err.message}`, err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === "development" ? err.message : "Internal server error"
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    logger.success(`Server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
  });
}).catch((err) => {
  logger.error("❌ Failed to connect to MongoDB:", err);
  process.exit(1);
});
