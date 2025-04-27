const mongoose = require("mongoose");
const logger = require("../utils/logger");
require("dotenv").config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      retryWrites: true,
      w: "majority",
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      heartbeatFrequencyMS: 10000,
    });

    logger.success(`MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('error', err => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.success('MongoDB reconnected');
    });

    return conn;
  } catch (error) {
    logger.error('MongoDB Connection Failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
