const mongoose = require('mongoose');

const vacancySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 200 },
    description: { type: String, default: '' },
    requirements: { type: String, default: '' },
    salary: { type: String, default: '' },
    location: { type: String, default: '' },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'remote', 'project'],
      default: 'full-time',
    },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vacancy', vacancySchema);
