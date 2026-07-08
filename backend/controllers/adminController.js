const User = require('../models/User');
const Course = require('../models/Course');
const Article = require('../models/Article');
const Enrollment = require('../models/Enrollment');
const Application = require('../models/Application');
const Gallery = require('../models/Gallery');
const Testimonial = require('../models/Testimonial');
const Faq = require('../models/Faq');
const Scholarship = require('../models/Scholarship');
const paginate = require('../utils/paginate');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');

// ─── STATISTIKA ───────────────────────────────────────────────────────────────

const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart  = new Date(now); weekStart.setDate(now.getDate() - 7);

    const [
      totalUsers,
      totalCourses,
      totalArticles,
      totalEnrollments,
      totalApplications,
      newApplications,
      todayApplications,
      weekApplications,
      recentUsers,
      recentApplications,
      totalGallery,
      totalTestimonials,
      totalFAQs,
      totalScholarships,
      applicationsByStatus,
    ] = await Promise.all([
      User.countDocuments({ role: 'USER' }),
      Course.countDocuments({ isActive: true }),
      Article.countDocuments({ isPublished: true }),
      Enrollment.countDocuments(),
      Application.countDocuments(),
      Application.countDocuments({ status: 'yangi' }),
      Application.countDocuments({ createdAt: { $gte: todayStart } }),
      Application.countDocuments({ createdAt: { $gte: weekStart } }),
      User.find({ role: 'USER' }).sort({ createdAt: -1 }).limit(5).select('name email createdAt'),
      Application.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('fullName phone grade status createdAt')
        .populate('course', 'title'),
      Gallery.countDocuments(),
      Testimonial.countDocuments({ isActive: true }),
      Faq.countDocuments({ isActive: true }),
      Scholarship.countDocuments({ isActive: true }),
      Application.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);

    const monthlyEnrollments = await Enrollment.aggregate([
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 },
    ]);

    return sendSuccess(
      res,
      {
        stats: {
          totalUsers,
          totalCourses,
          totalArticles,
          totalEnrollments,
          totalApplications,
          newApplications,
          todayApplications,
          weekApplications,
          totalGallery,
          totalTestimonials,
          totalFAQs,
          totalScholarships,
          applicationsByStatus,
        },
        recentUsers,
        recentApplications,
        monthlyEnrollments,
      },
      'Dashboard statistikasi'
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ─── FOYDALANUVCHILAR ──────────────────────────────────────────────────────────

const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search, isActive } = req.query;

    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const { data, meta } = await paginate(User, query, {
      page,
      limit,
      sort: { createdAt: -1 },
      select: '-password -refreshTokens',
    });

    return sendPaginated(res, data, meta, 'Foydalanuvchilar ro\'yxati');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -refreshTokens')
      .populate('enrolledCourses', 'title slug image');

    if (!user) return sendError(res, 'Foydalanuvchi topilmadi', 404);

    const enrollments = await Enrollment.find({ user: user._id }).populate('course', 'title slug');

    return sendSuccess(res, { user, enrollments }, 'Foydalanuvchi ma\'lumotlari');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, phone, role, isActive } = req.body;
    const isSuperAdmin = req.user.role === 'SUPER_ADMIN';

    if (req.params.id === req.user._id.toString() && role) {
      return sendError(res, 'O\'zingizning rolingizni o\'zgartira olmaysiz', 400);
    }

    const target = await User.findById(req.params.id);
    if (!target) return sendError(res, 'Foydalanuvchi topilmadi', 404);

    // SUPER_ADMIN hisobini faqat SUPER_ADMIN tahrirlay oladi
    if (target.role === 'SUPER_ADMIN' && !isSuperAdmin) {
      return sendError(res, 'Super Admin hisobini tahrirlash mumkin emas', 403);
    }

    // Rolni faqat SUPER_ADMIN o'zgartira oladi (privilege escalation himoyasi)
    if (role !== undefined && role !== target.role && !isSuperAdmin) {
      return sendError(res, 'Foydalanuvchi rolini faqat Super Admin o\'zgartira oladi', 403);
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (role !== undefined && isSuperAdmin) updates.role = role;
    if (isActive !== undefined) updates.isActive = isActive;

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password -refreshTokens');

    return sendSuccess(res, { user }, 'Foydalanuvchi yangilandi');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return sendError(res, 'O\'z hisobingizni o\'chira olmaysiz', 400);
    }

    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 'Foydalanuvchi topilmadi', 404);

    if (user.role === 'SUPER_ADMIN') {
      return sendError(res, 'Super admin hisobini o\'chirish mumkin emas', 403);
    }

    // Boshqa ADMIN hisobini faqat SUPER_ADMIN o'chira oladi
    if (user.role === 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      return sendError(res, 'Admin hisobini o\'chirish uchun Super Admin huquqi kerak', 403);
    }

    const enrollments = await Enrollment.find({ user: req.params.id });
    const courseIds = enrollments.map((e) => e.course);
    if (courseIds.length > 0) {
      await Course.updateMany(
        { _id: { $in: courseIds } },
        { $inc: { enrollmentCount: -1 } }
      );
    }

    await User.findByIdAndDelete(req.params.id);
    await Enrollment.deleteMany({ user: req.params.id });

    return sendSuccess(res, {}, 'Foydalanuvchi o\'chirildi');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const toggleUserBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -refreshTokens');
    if (!user) return sendError(res, 'Foydalanuvchi topilmadi', 404);

    // O'zini bloklab qo'ymaslik
    if (req.params.id === req.user._id.toString()) {
      return sendError(res, 'O\'z hisobingizni bloklay olmaysiz', 400);
    }
    // Privilege himoyasi: ADMIN, SUPER_ADMIN'ni bloklay olmaydi
    if (user.role === 'SUPER_ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      return sendError(res, 'Super Admin hisobini bloklash mumkin emas', 403);
    }

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    const status = user.isActive ? 'faollashtirildi' : 'bloklandi';
    return sendSuccess(res, { user }, `Foydalanuvchi ${status}`);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ─── ARIZALAR ─────────────────────────────────────────────────────────────────

const getApplications = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, grade, search } = req.query;

    const query = {};
    if (status) query.status = status;
    if (grade) query.grade = grade;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const { data, meta } = await paginate(Application, query, {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: [
        { path: 'course', select: 'title' },
        { path: 'handledBy', select: 'name' },
      ],
    });

    return sendPaginated(res, data, meta, 'Arizalar ro\'yxati');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const ALLOWED_APPLICATION_STATUSES = ['yangi', 'ko\'rib_chiqilmoqda', 'qabul_qilindi', 'rad_etildi'];

const updateApplicationStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    // Status enum'dan tashqarida bo'lsa — rad etamiz (filtr/statistika buzilmasligi uchun)
    if (status !== undefined && !ALLOWED_APPLICATION_STATUSES.includes(status)) {
      return sendError(res, 'Noto\'g\'ri ariza holati', 400);
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      {
        status,
        note,
        handledBy: req.user._id,
        handledAt: new Date(),
      },
      { new: true, runValidators: true }
    ).populate('course', 'title');

    if (!application) return sendError(res, 'Ariza topilmadi', 404);

    return sendSuccess(res, { application }, 'Ariza holati yangilandi');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) return sendError(res, 'Ariza topilmadi', 404);

    return sendSuccess(res, {}, 'Ariza o\'chirildi');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// ─── KURSLAR (ADMIN) ──────────────────────────────────────────────────────────

const getAdminCourses = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search, isActive } = req.query;

    const query = {};
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) query.$text = { $search: search };

    const { data, meta } = await paginate(Course, query, {
      page,
      limit,
      sort: { createdAt: -1 },
    });

    return sendPaginated(res, data, meta, 'Kurslar ro\'yxati (admin)');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const getAdminArticles = async (req, res) => {
  try {
    const { page = 1, limit = 20, isPublished, search } = req.query;

    const query = {};
    if (isPublished !== undefined) query.isPublished = isPublished === 'true';
    if (search) query.$text = { $search: search };

    const { data, meta } = await paginate(Article, query, {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: { path: 'author', select: 'name' },
    });

    return sendPaginated(res, data, meta, 'Maqolalar ro\'yxati (admin)');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserBlock,
  getApplications,
  updateApplicationStatus,
  deleteApplication,
  getAdminCourses,
  getAdminArticles,
};
