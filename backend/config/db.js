const mongoose = require("mongoose");
const logger = require("../utils/logger");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // Add these options for better reliability
      retryWrites: true,
      w: "majority",
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    logger.success("MongoDB Connected");
  } catch (error) {
    logger.error("MongoDB Connection Failed", error);
    process.exit(1);
  }
};

module.exports = connectDB;
