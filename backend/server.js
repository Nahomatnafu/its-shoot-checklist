const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const checklistRoutes = require("./routes/checklistRoutes"); // Import checklist routes
const cors = require("cors");
require("dotenv").config();

const app = express();

// Connect to MongoDB
connectDB().catch((error) => {
  console.error("❌ MongoDB Connection Failed:", error.message);
  process.exit(1);
});

// Middleware
app.use(express.json());

// Add this middleware
app.use(cors());

console.log("Loaded Routes:");
console.log(" - /api/auth (Authentication)");
console.log(" - /api/checklist (Checklist)");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/checklist", checklistRoutes); // Add protected checklist route

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
