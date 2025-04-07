const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // Ensure bcrypt is imported
require("dotenv").config();

const router = express.Router();

// @route   GET /api/auth/users
// @desc    Get all users (Admin-Only)
// @access  Admins Only
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords
    res.json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "❌ Server error" });
  }
});

// @route   DELETE /api/auth/users/:id
// @desc    Delete a user (Admin-Only)
// @access  Admins Only
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "❌ User not found" });
    }

    await user.deleteOne(); // Delete the user

    res.json({ message: "✅ User deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ message: "❌ Server error" });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }

    console.log("🔍 Stored Hashed Password:", user.password); // Log stored password
    console.log("🔍 Entered Password:", password); // Log entered password

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔍 Password Match Result:", isMatch); // Log comparison result

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        position: user.position, // Include the position here
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   POST /api/auth/register
// @desc    Register a new user (Admin-Only)
// @access  Admins Only
router.post("/register", async (req, res) => {
  const { name, email, position, role, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      name,
      email,
      position,
      role,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "✅ User added successfully" });
  } catch (error) {
    console.error("❌ Error adding user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/auth/users/:id
// @desc    Update user details (Admins Only)
// @access  Admins Only
router.put("/users/:id", async (req, res) => {
  try {
    const { name, email, position, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, position, role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "✅ User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("❌ Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/user/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
