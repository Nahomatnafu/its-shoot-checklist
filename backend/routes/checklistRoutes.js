const express = require("express");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// @route   GET /api/checklist
// @desc    Get checklist data (Protected Route)
// @access  Private
router.get("/", protect, (req, res) => {
  res.json({
    message: "Welcome to the protected checklist route!",
    user: req.user,
  });
});

module.exports = router;
