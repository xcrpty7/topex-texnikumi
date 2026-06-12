const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Video sarlavhasi kiritilishi shart'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  url: {
    type: String,
    required: [true, 'Video havolasi kiritilishi shart']
  },
  thumbnail: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 0
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

module.exports = mongoose.model('Video', videoSchema);
