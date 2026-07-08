const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ism kiritilishi shart'],
      trim: true,
      minlength: [2, 'Ism kamida 2 ta belgi bo\'lishi kerak'],
      maxlength: [100, 'Ism 100 ta belgidan oshmasligi kerak'],
    },
    password: {
      type: String,
      required: [true, 'Parol kiritilishi shart'],
      minlength: [4, 'Parol kamida 4 ta belgi bo\'lishi kerak'],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    // Admin o'zi o'ylab topadigan login (username) — telefon o'rniga ham kirish mumkin
    login: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
      minlength: [3, 'Login kamida 3 ta belgi bo\'lishi kerak'],
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN', 'SUPER_ADMIN'],
      default: 'USER',
    },
    avatar: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    refreshTokens: [
      {
        token: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Telefon raqamini har doim normallashtiramiz (bo'shliq/chiziqcha olib tashlanadi)
userSchema.pre('save', function (next) {
  if (this.isModified('phone') && this.phone) {
    this.phone = this.phone.replace(/[\s\-()]/g, '').trim();
  }
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
