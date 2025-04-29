const mongoose = require('mongoose');

const ImageWaiverSchema = new mongoose.Schema({
  projectName: String,
  projectDate: String,
  name: {
    type: String,
    required: true
  },
  address: String,
  phone: String,
  city: String,
  state: String,
  zip: String,
  signature: String,
  date: {
    type: Date,
    default: Date.now,
    required: true
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

