const mongoose = require('mongoose');

const ShootSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  checklist: {
    type: Object,
    required: true
  },
  template: {
    type: Object,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Shoot', ShootSchema);