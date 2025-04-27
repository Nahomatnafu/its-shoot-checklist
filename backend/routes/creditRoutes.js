const express = require('express');
const router = express.Router();
const Credit = require('../models/Credit');
const { protect } = require('../middleware/authMiddleware');

// Get all credits for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const credits = await Credit.find({ user: req.user._id });
    res.json(credits);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new credit
router.post('/', protect, async (req, res) => {
  try {
    const credit = new Credit({
      ...req.body,
      user: req.user._id
    });
    const savedCredit = await credit.save();
    res.status(201).json(savedCredit);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update credit
router.put('/:id', protect, async (req, res) => {
  try {
    const credit = await Credit.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!credit) return res.status(404).json({ message: 'Credit not found' });
    res.json(credit);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete credit
router.delete('/:id', protect, async (req, res) => {
  try {
    const credit = await Credit.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    if (!credit) return res.status(404).json({ message: 'Credit not found' });
    res.json({ message: 'Credit deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
