const mongoose = require('mongoose');

const homeVideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Video sarlavhasi kiritilishi shart'],
    trim: true
  },
  url: {
    type: String,
    required: [true, 'Video havolasi kiritilishi shart']
  },
  photo: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('HomeVideo', homeVideoSchema);
