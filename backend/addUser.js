const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = require("./models/User");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    // Check if user already exists
    const existingUser = await User.findOne({ email: "john@example.com" });
    if (existingUser) {
      console.log("⚠️ User already exists. Deleting and re-adding...");
      await User.deleteOne({ email: "john@example.com" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash("password123", 10);

    const user = new User({
      name: "John Doe",
      email: "john@example.com",
      password: hashedPassword, // Store hashed password
      role: "student",
    });

    await user.save();
    console.log("✅ User added successfully with a hashed password.");
    mongoose.connection.close();
  })
  .catch((err) => console.log("❌ MongoDB Connection Failed:", err));
