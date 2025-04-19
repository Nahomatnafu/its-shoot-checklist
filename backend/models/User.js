const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    role: {
      type: String,
      enum: {
        values: ["student", "admin", "its-staff"],
        message: "{VALUE} is not a valid role",
      },
      default: "student",
    },
    position: {
      type: String,
      default: process.env.DEFAULT_POSITION || "Visual Content Producer",
    },
  },
  { timestamps: true }
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

module.exports = mongoose.model("User", UserSchema);
