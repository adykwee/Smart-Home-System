// Bạn có thể cài `express-rate-limit` để chống SPAM API
const rateLimiter = (req, res, next) => {
  // Logic giới hạn call API
  next();
};

module.exports = rateLimiter;
