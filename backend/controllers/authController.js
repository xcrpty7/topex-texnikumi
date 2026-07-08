const User = require('../models/User');
const mongoose = require('mongoose');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/response');

// Telefon raqamini standartlashtirish: bo'shliq/chiziqcha/qavslarni olib tashlash
const normalizePhone = (p) => (p ? String(p).replace(/[\s\-()]/g, '').trim() : '');

const register = async (req, res) => {
  try {
    let { name, password, phone } = req.body;
    phone = phone ? normalizePhone(phone) : undefined;

    if (!phone) {
      return sendError(res, 'Telefon raqami kiritilishi shart', 400);
    }

    const existing = await User.findOne({ phone });
    if (existing) {
      return sendError(res, 'Bu telefon raqami allaqachon ro\'yxatdan o\'tgan', 400);
    }

    let user;
    try {
      user = await User.create({ name, password, phone });
    } catch (createErr) {
      // E11000 = duplicate key → eski email_1 index qoldig'i
      if (createErr.code === 11000) {
        try {
          await mongoose.connection.collection('users').dropIndex('email_1');
          console.log('✅ email_1 index o\'chirildi (auto-fix authController)');
          user = await User.create({ name, password, phone });
        } catch {
          return sendError(res, 'Ro\'yxatdan o\'tishda xatolik. Iltimos keyinroq urinib ko\'ring', 500);
        }
      } else {
        throw createErr;
      }
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshTokens.push({ token: refreshToken });
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccess(
      res,
      { user: user.toJSON(), accessToken },
      'Ro\'yxatdan muvaffaqiyatli o\'tdingiz',
      201
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const login = async (req, res) => {
  try {
    const { identifier, phone, login, password } = req.body;
    const idRaw = String(identifier || phone || login || '').trim();
    if (!idRaw) {
      return sendError(res, 'Telefon yoki login kiritilishi shart', 400);
    }

    const conds = [{ login: idRaw.toLowerCase() }];
    const normPhone = normalizePhone(idRaw);
    if (normPhone) conds.push({ phone: normPhone });

    const user = await User.findOne({ $or: conds }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return sendError(res, 'Login yoki parol noto\'g\'ri', 401);
    }

    if (!user.isActive) {
      return sendError(res, 'Hisobingiz bloklangan. Admin bilan bog\'laning', 403);
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshTokens.push({ token: refreshToken });
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccess(res, { user: user.toJSON(), accessToken }, 'Tizimga muvaffaqiyatli kirdingiz');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.refreshTokens = user.refreshTokens.filter((t) => t.token !== token);
        await user.save({ validateBeforeSave: false });
      }
    }

    res.clearCookie('refreshToken');
    return sendSuccess(res, {}, 'Tizimdan chiqdingiz');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!token) {
      return sendError(res, 'Refresh token topilmadi', 401);
    }

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      return sendError(res, 'Foydalanuvchi topilmadi', 401);
    }

    const tokenExists = user.refreshTokens.some((t) => t.token === token);
    if (!tokenExists) {
      return sendError(res, 'Token yaroqsiz', 401);
    }

    if (!user.isActive) {
      return sendError(res, 'Hisobingiz bloklangan', 403);
    }

    const newAccessToken = generateAccessToken(user._id, user.role);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshTokens = user.refreshTokens.filter((t) => t.token !== token);
    user.refreshTokens.push({ token: newRefreshToken });
    await user.save({ validateBeforeSave: false });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccess(res, { accessToken: newAccessToken }, 'Token yangilandi');
  } catch (error) {
    return sendError(res, 'Token yaroqsiz yoki muddati tugagan', 401);
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('enrolledCourses', 'title slug image');
    return sendSuccess(res, { user }, 'Foydalanuvchi ma\'lumotlari');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, login } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (phone !== undefined) updates.phone = phone ? normalizePhone(phone) : phone;
    if (login !== undefined && login !== '') updates.login = String(login).toLowerCase().trim();
    if (req.file) updates.avatar = `/uploads/avatars/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    return sendSuccess(res, { user }, 'Profil yangilandi');
  } catch (error) {
    if (error.code === 11000) {
      return sendError(res, 'Bu login yoki telefon raqami allaqachon band', 400);
    }
    return sendError(res, error.message, 500);
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword))) {
      return sendError(res, 'Joriy parol noto\'g\'ri', 400);
    }

    user.password = newPassword;
    await user.save();

    return sendSuccess(res, {}, 'Parol muvaffaqiyatli o\'zgartirildi');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

module.exports = { register, login, logout, refreshToken, getMe, updateProfile, changePassword };
