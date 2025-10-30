const express = require("express");
const router = express.Router();
const Shoot = require("../models/Shoot");
const { protect } = require("../middleware/authMiddleware");

// Get all shoots (shared across all users)
router.get("/", protect, async (req, res) => {
  try {
    const shoots = await Shoot.find({})
      .populate('user', 'name email')
      .sort({ date: -1 });
    res.json(shoots);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single shoot by ID (shared across all users)
router.get("/:id", protect, async (req, res) => {
  try {
    const shoot = await Shoot.findById(req.params.id);
    if (!shoot) {
      return res.status(404).json({ message: "Shoot not found" });
    }
    res.json(shoot);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create new shoot
router.post("/", protect, async (req, res) => {
  try {
    const shoot = new Shoot({
      ...req.body,
      user: req.user._id,
    });

    const savedShoot = await shoot.save();
    res.status(201).json(savedShoot);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update shoot (shared across all users)
router.put("/:id", protect, async (req, res) => {
  try {
    const shoot = await Shoot.findByIdAndUpdate(
      req.params.id,
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
    // Allow deletion if user owns the shoot OR is an admin
    const query = {
      _id: req.params.id,
      $or: [
        { user: req.user._id },
        { user: null } // Allow deletion of records with no user (legacy data)
      ]
    };

    const shoot = await Shoot.findOneAndDelete(query);
    if (!shoot) return res.status(404).json({ message: "Shoot not found" });
    res.json({ message: "Shoot deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

