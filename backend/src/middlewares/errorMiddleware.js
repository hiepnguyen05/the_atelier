const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  // Log lỗi để debug (chỉ log ở môi trường dev hoặc log vào file hệ thống)
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: err.message || 'Internal Server Error',
    // Chỉ trả về stack trace khi không phải môi trường production
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;
