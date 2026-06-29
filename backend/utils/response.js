const sendSuccess = (res, data = {}, message = 'Muvaffaqiyatli', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...data,
  });
};

const sendError = (res, message = 'Xatolik yuz berdi', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
};

const sendPaginated = (res, data, meta, message = 'Muvaffaqiyatli') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    meta,
  });
};

module.exports = { sendSuccess, sendError, sendPaginated };
