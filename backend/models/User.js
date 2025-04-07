const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define User Schema
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "admin", "its-staff"], // Users can be either a student or faculty
      default: "student",
    },
    position: {
      type: String,
      default: "Visual Content Producer", // ✅ Add position field with default value
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps automatically
);

// Hash password before saving (Prevent Double Hashing)
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // Prevent hashing if already hashed
  if (!this.password.startsWith("$2b$")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});

// Compare entered password with hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.error("❌ Password comparison error:", error);
    return false;
  }
};

// Export the model
const User = mongoose.model("User", UserSchema);
module.exports = User;
