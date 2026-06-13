const mongoose = require('mongoose');

const directionSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  icon:     { type: String, default: 'BookOpen' },
  desc:     { type: String, default: '' },
  img:      { type: String, default: '' },
  duration: { type: String, default: '' },
  features: [{ type: String }],
  order:    { type: Number, default: 0 },
  active:   { type: Boolean, default: true },
}, { timestamps: true });

directionSchema.index({ order: 1, createdAt: -1 });

module.exports = mongoose.model('Direction', directionSchema);
