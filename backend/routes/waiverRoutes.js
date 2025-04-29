const express = require('express');
const router = express.Router();
const ImageWaiver = require('../models/ImageWaiver');
const { protect } = require('../middleware/authMiddleware');

// Get all waivers for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const waivers = await ImageWaiver.find({ user: req.user._id });
    res.json(waivers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new waiver
router.post('/', protect, async (req, res) => {
  try {
    // Only validate name
    if (!req.body.name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const waiver = new ImageWaiver({
      ...req.body,
      user: req.user._id,
      date: req.body.date || new Date() // Ensure date is set
    });
    
    const savedWaiver = await waiver.save();
    res.status(201).json(savedWaiver);
  } catch (error) {
    console.error('Error saving waiver:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete waiver
router.delete('/:id', protect, async (req, res) => {
  try {
    const waiver = await ImageWaiver.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    if (!waiver) return res.status(404).json({ message: 'Waiver not found' });
    res.json({ message: 'Waiver deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

