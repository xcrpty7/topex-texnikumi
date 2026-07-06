const mongoose = require('mongoose');

const amoCrmTokenSchema = new mongoose.Schema({
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('AmoCrmToken', amoCrmTokenSchema);
