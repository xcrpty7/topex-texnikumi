const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { sendError } = require('../utils/response');

const storage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const dest = path.join(__dirname, `../uploads/${folder}`);
      fs.mkdirSync(dest, { recursive: true });
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = `${folder}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, name);
    },
  });

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const extname = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowed.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Faqat rasm fayllari qabul qilinadi (jpeg, jpg, png, gif, webp)'));
  }
};

const videoFilter = (req, file, cb) => {
  const allowed = /mp4|mov|avi|wmv|mkv|webm/;
  const extname = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype.startsWith('video/');
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Faqat video fayllari qabul qilinadi (mp4, mov, avi, webm, etc.)'));
  }
};

const MAX_IMAGE_MB = Math.max(
  5,
  Math.floor((parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024) / 1024 / 1024)
);
const MAX_VIDEO_MB = 500;

const createUpload = (folder, filter = fileFilter, size = MAX_IMAGE_MB) =>
  multer({
    storage: storage(folder),
    limits: { fileSize: size * 1024 * 1024 },
    fileFilter: filter,
  });

const uploadImage = createUpload('images');
const uploadAvatar = createUpload('avatars');
const uploadPost = createUpload('posts');
const uploadGallery = createUpload('gallery');
const uploadTestimonial = createUpload('testimonials');
const uploadTeacher = createUpload('teachers');
const uploadVideo = createUpload('videos', videoFilter, MAX_VIDEO_MB);

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return sendError(res, 'Fayl hajmi juda katta', 400);
    }
    return sendError(res, err.message, 400);
  }
  if (err) return sendError(res, err.message, 400);
  next();
};

module.exports = {
  uploadImage, uploadAvatar, uploadPost, uploadGallery, uploadTestimonial,
  uploadTeacher, uploadVideo, handleMulterError
};
