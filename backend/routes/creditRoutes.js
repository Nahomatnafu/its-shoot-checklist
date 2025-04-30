const express = require('express');
const router = express.Router();
const Credit = require('../models/Credit');
const { protect } = require('../middleware/authMiddleware');

// Get all credits
router.get('/', protect, async (req, res) => {
  try {
    const credits = await Credit.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(credits);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new credit
router.post('/', protect, async (req, res) => {
  try {
    console.log('Received credit data:', req.body);
    console.log('User ID:', req.user._id);

    // Only validate project name
    if (!req.body.projectName?.trim()) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    // Create and save the credit with all roles, even empty ones
    const credit = new Credit({
      projectName: req.body.projectName.trim(),
      roles: req.body.roles || [],  // Accept all roles without validation
      user: req.user._id
    });

    const savedCredit = await credit.save();
    console.log('Saved credit:', savedCredit);
    res.status(201).json(savedCredit);
  } catch (error) {
    console.error('Server error while saving credit:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Update credit
router.put('/:id', protect, async (req, res) => {
  try {
    // Only validate project name
    if (!req.body.projectName?.trim()) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    // Remove the user check from the query
    const credit = await Credit.findByIdAndUpdate(
      req.params.id,  // Only check for credit ID
      {
        projectName: req.body.projectName.trim(),
        roles: req.body.roles || []  // Accept all roles without validation
      },
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






