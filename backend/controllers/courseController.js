const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const paginate = require('../utils/paginate');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');

const getCourses = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, level, search, featured } = req.query;

    const query = { isActive: true };
    if (category) query.category = category;
    if (level) query.level = level;
    if (featured === 'true') query.isFeatured = true;
    if (search) {
      query.$text = { $search: search };
    }

    const { data, meta } = await paginate(Course, query, {
      page,
      limit,
      sort: { isFeatured: -1, createdAt: -1 },
    });

    return sendPaginated(res, data, meta, 'Kurslar ro\'yxati');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const getCourseBySlug = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug, isActive: true }).populate(
      'createdBy',
      'name'
    );

    if (!course) {
      return sendError(res, 'Kurs topilmadi', 404);
    }

    let isEnrolled = false;
    if (req.user) {
      const enrollment = await Enrollment.findOne({ user: req.user._id, course: course._id });
      isEnrolled = !!enrollment;
    }

    return sendSuccess(res, { course, isEnrolled }, 'Kurs ma\'lumotlari');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const normalizeCourseData = (body) => {
  const data = { ...body };
  ['isActive', 'isFree', 'isFeatured'].forEach((k) => {
    if (data[k] !== undefined) data[k] = data[k] === 'true' || data[k] === true;
  });
  if (data.price !== undefined && data.price !== '') data.price = Number(data.price);
  return data;
};

const createCourse = async (req, res) => {
  try {
    const data = { ...normalizeCourseData(req.body), createdBy: req.user._id };
    if (req.file) data.image = `/uploads/images/${req.file.filename}`;

    const course = await Course.create(data);
    return sendSuccess(res, { course }, 'Kurs muvaffaqiyatli yaratildi', 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const updateCourse = async (req, res) => {
  try {
    const updates = normalizeCourseData(req.body);
    if (req.file) updates.image = `/uploads/images/${req.file.filename}`;

    const course = await Course.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!course) return sendError(res, 'Kurs topilmadi', 404);

    return sendSuccess(res, { course }, 'Kurs yangilandi');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return sendError(res, 'Kurs topilmadi', 404);

    await Enrollment.deleteMany({ course: req.params.id });

    return sendSuccess(res, {}, 'Kurs o\'chirildi');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course || !course.isActive) {
      return sendError(res, 'Kurs topilmadi', 404);
    }

    const existing = await Enrollment.findOne({ user: req.user._id, course: course._id });
    if (existing) {
      return sendError(res, 'Siz bu kursga allaqachon yozilgansiz', 400);
    }

    const enrollment = await Enrollment.create({ user: req.user._id, course: course._id });

    await Course.findByIdAndUpdate(course._id, { $inc: { enrollmentCount: 1 } });
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { enrolledCourses: course._id },
    });

    return sendSuccess(res, { enrollment }, 'Kursga muvaffaqiyatli yozildingiz', 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const toggleCourseStatus = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return sendError(res, 'Kurs topilmadi', 404);

    course.isActive = !course.isActive;
    await course.save();

    const status = course.isActive ? 'chop etildi' : 'qoralama holatiga o\'tkazildi';
    return sendSuccess(res, { course }, `Kurs ${status}`);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

module.exports = {
  getCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  toggleCourseStatus,
};
