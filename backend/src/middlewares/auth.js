const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Lấy token từ header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const secret = process.env.JWT_SECRET || 'super_secret_key_123';
      const decoded = jwt.verify(token, secret);

      // Lấy user từ token (bỏ qua mật khẩu)
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ status: "error", message: "Không tìm thấy người dùng" });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ status: "error", message: "Không có quyền truy cập, token không hợp lệ" });
    }
  } else {
    return res.status(401).json({ status: "error", message: "Không có quyền truy cập, không có token" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ status: "error", message: "Không có quyền truy cập, yêu cầu quyền Admin" });
  }
};

module.exports = { protect, adminOnly };
