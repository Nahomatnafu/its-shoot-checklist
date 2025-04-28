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
    console.log('Received credit data:', req.body);
    console.log('User ID:', req.user._id);

    // Validate project name
    if (!req.body.projectName?.trim()) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    // Validate roles
    if (!Array.isArray(req.body.roles) || req.body.roles.length === 0) {
      return res.status(400).json({ message: 'At least one role is required' });
    }

    // Clean and validate roles data
    const validRoles = req.body.roles.filter(role => {
      return role.role?.trim() && 
             Array.isArray(role.people) && 
             role.people.some(person => person?.trim());
    });

    if (validRoles.length === 0) {
      return res.status(400).json({ 
        message: 'At least one role with a valid person is required' 
      });
    }

    // Clean up the data
    const cleanedRoles = req.body.roles.map(role => ({
      role: role.role.trim(),
      people: role.people.filter(person => person?.trim()).map(person => person.trim())
    }));

    // Create and save the credit
    const credit = new Credit({
      projectName: req.body.projectName.trim(),
      roles: cleanedRoles,
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



