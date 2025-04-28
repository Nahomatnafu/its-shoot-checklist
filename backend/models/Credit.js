const mongoose = require('mongoose');

const CreditSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true
  },
  roles: [{
    role: String,
    people: [String]
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Credit', CreditSchema);




