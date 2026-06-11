const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'To\'liq ism kiritilishi shart'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Telefon raqami kiritilishi shart'],
      trim: true,
    },
    grade: {
      type: String,
      enum: ['9', '11'],
      required: [true, 'Sinf kiritilishi shart'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      default: null,
    },
    message: {
      type: String,
      maxlength: [1000, 'Xabar 1000 ta belgidan oshmasligi kerak'],
    },
    status: {
      type: String,
      enum: ['yangi', 'ko\'rib_chiqilmoqda', 'qabul_qilindi', 'rad_etildi'],
      default: 'yangi',
    },
    note: {
      type: String,
    },
    handledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    handledAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ status: 1, createdAt: -1 });
applicationSchema.index({ phone: 1 });

module.exports = mongoose.model('Application', applicationSchema);
