const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  role:    { type: String, default: '' },
  image:   { type: String, default: '' },
  order:   { type: Number, default: 0 },
  active:  { type: Boolean, default: true },
}, { timestamps: true });

teacherSchema.index({ order: 1, createdAt: -1 });

module.exports = mongoose.model('Teacher', teacherSchema);
