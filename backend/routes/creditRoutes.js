const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Get all credits
router.get('/', protect, async (req, res) => {
  try {
    res.json({ message: "Credit route working" });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;