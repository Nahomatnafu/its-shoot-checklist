const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const checklistRoutes = require("./routes/checklistRoutes");
const cors = require("cors");
const logger = require("./utils/logger");
require("dotenv").config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://its-shoot-checklist.vercel.app",
  "https://its-shoot-checklist-git-main-nahom-atnafus-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors()); // handle preflight

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/checklist", checklistRoutes);

app.get("/api/test", (req, res) => {
  res.json({ message: "CORS is working" });
});

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    error: "Something broke!",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.success(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
});
