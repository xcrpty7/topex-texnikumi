const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server xatosi';

  if (err.name === 'ValidationError' && err.errors) {
    statusCode = 400;
    const errors = Object.values(err.errors).map((e) => e.message);
    message = errors.join('. ');
  }

  if (err.code === 11000 && err.keyValue) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Bu ${field} allaqachon mavjud`;
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Noto\'g\'ri ID format';
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Xato:', err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Yo'l topilmadi: ${req.originalUrl}`,
  });
};

module.exports = { errorHandler, notFound };
