const mongoose = require('mongoose');
const slugify = require('slugify');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Kurs nomi kiritilishi shart'],
      trim: true,
      maxlength: [200, 'Kurs nomi 200 ta belgidan oshmasligi kerak'],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Kurs tavsifi kiritilishi shart'],
    },
    shortDescription: {
      type: String,
      maxlength: [500, 'Qisqa tavsif 500 ta belgidan oshmasligi kerak'],
    },
    category: {
      type: String,
      required: [true, 'Kategoriya kiritilishi shart'],
    },
    level: {
      type: String,
      default: 'beginner',
    },
    duration: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: null,
    },
    videoUrl: {
      type: String,
      default: null,
    },
    instructor: {
      name: String,
      bio: String,
      avatar: String,
    },
    curriculum: [
      {
        title: String,
        lessons: [String],
      },
    ],
    requirements: [String],
    outcomes: [String],
    isFree: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    enrollmentCount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

courseSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

courseSchema.index({ title: 'text', description: 'text', category: 'text' });
courseSchema.index({ category: 1, level: 1 });

module.exports = mongoose.model('Course', courseSchema);
