const mongoose = require('mongoose');
const slugify = require('slugify');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Maqola sarlavhasi kiritilishi shart'],
      trim: true,
      maxlength: [300, 'Sarlavha 300 ta belgidan oshmasligi kerak'],
    },
    slug: {
      type: String,
      unique: true,
    },
    content: {
      type: String,
      required: [true, 'Maqola matni kiritilishi shart'],
    },
    excerpt: {
      type: String,
      maxlength: [500, 'Qisqa matn 500 ta belgidan oshmasligi kerak'],
    },
    image: {
      type: String,
      default: null,
    },
    videoUrl: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      default: 'Yangiliklar',
    },
    tags: [String],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

articleSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

articleSchema.index({ title: 'text', content: 'text', tags: 'text' });
articleSchema.index({ isPublished: 1, publishedAt: -1 });

module.exports = mongoose.model('Article', articleSchema);
