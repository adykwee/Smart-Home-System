const rateLimit = require('express-rate-limit');

// Giới hạn chung cho toàn bộ API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Mỗi IP tối đa 100 request trong 15 phút
  message: { status: 'error', message: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Giới hạn khắt khe hơn cho các endpoint nhạy cảm (như Login/Register)
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 10, // Mỗi IP tối đa 10 request login/register trong 1 giờ
  message: { status: 'error', message: 'Quá nhiều lần thử đăng nhập/đăng ký, vui lòng thử lại sau 1 giờ.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { apiLimiter, authLimiter };
