const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Lỗi hệ thống nội bộ",
  });
};

module.exports = errorHandler;
