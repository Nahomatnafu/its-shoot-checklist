const express = require("express");
const router = express.Router();
const Shoot = require("../models/Shoot");
const { protect } = require("../middleware/authMiddleware");

// Get all shoots for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const shoots = await Shoot.find({ user: req.user._id });
    res.json(shoots);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create new shoot
router.post("/", protect, async (req, res) => {
  try {
    console.log("Received shoot data:", req.body);

    const shoot = new Shoot({
      ...req.body,
      user: req.user._id,
    });

    const savedShoot = await shoot.save();
    console.log("Saved shoot:", savedShoot);

    res.status(201).json(savedShoot);
  } catch (error) {
    console.error("Error saving shoot:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Get single shoot by ID (new route)
router.get("/:id", protect, async (req, res) => {
  try {
    const shoot = await Shoot.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!shoot) {
      return res.status(404).json({ message: "Shoot not found" });
    }
    res.json(shoot);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update shoot
router.put("/:id", protect, async (req, res) => {
  try {
    const shoot = await Shoot.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!shoot) return res.status(404).json({ message: "Shoot not found" });
    res.json(shoot);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete shoot
router.delete("/:id", protect, async (req, res) => {
  try {
    const shoot = await Shoot.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!shoot) return res.status(404).json({ message: "Shoot not found" });
    res.json({ message: "Shoot deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
