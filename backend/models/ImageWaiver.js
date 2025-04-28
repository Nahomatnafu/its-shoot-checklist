const mongoose = require('mongoose');

const ImageWaiverSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true
  },
  projectDate: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zip: {
    type: String,
    required: true
  },
  signature: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  parentName: String,
  parentSignature: String,
  parentSignatureDate: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('ImageWaiver', ImageWaiverSchema);
