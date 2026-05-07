const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Helper để tạo token
const generateToken = (id, username, role) => {
  // Sử dụng khóa bí mật từ biến môi trường hoặc dự phòng bằng một string mặc định
  const secret = process.env.JWT_SECRET || 'super_secret_key_123';
  return jwt.sign({ id, username, role }, secret, {
    expiresIn: '1d', // Token hết hạn sau 1 ngày
  });
};

const userController = {
  // Lấy toàn bộ người dùng
  getAll: async (req, res, next) => {
    try {
      const users = await User.find().select('-password');
      res.status(200).json({ status: "success", data: users });
    } catch (error) { next(error); }
  },

  // Lấy 1 người dùng theo ID
  getById: async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) return res.status(404).json({ status: "error", message: "Không tìm thấy người dùng" });
      res.status(200).json({ status: "success", data: user });
    } catch (error) { next(error); }
  },

  // Tạo mới người dùng (Admin dùng để tạo)
  create: async (req, res, next) => {
    try {
      const { username, password, role } = req.body;
      const userExists = await User.findOne({ username });
      if (userExists) {
        return res.status(400).json({ status: "error", message: "Tên đăng nhập đã tồn tại" });
      }
      const user = await User.create({ username, password, role });
      res.status(201).json({ status: "success", data: { _id: user._id, username: user.username, role: user.role } });
    } catch (error) { next(error); }
  },

  // Cập nhật người dùng
  update: async (req, res, next) => {
    try {
      const { password, role } = req.body;
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ status: "error", message: "Không tìm thấy người dùng" });
      
      if (password) user.password = password;
      if (role) user.role = role;
      
      await user.save();
      res.status(200).json({ status: "success", data: { _id: user._id, username: user.username, role: user.role } });
    } catch (error) { next(error); }
  },

  // Xóa người dùng
  delete: async (req, res, next) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ status: "error", message: "Không tìm thấy người dùng" });
      res.status(200).json({ status: "success", message: "Đã xóa người dùng" });
    } catch (error) { next(error); }
  },

  // Đăng nhập
  login: async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      
      if (!user) {
        return res.status(401).json({ status: "error", message: "Tài khoản không tồn tại" });
      }

      const isPasswordCorrect = await user.comparePassword(password);
      if (!isPasswordCorrect) {
        return res.status(401).json({ status: "error", message: "Mật khẩu không chính xác" });
      }

      res.status(200).json({
        status: "success",
        data: {
          _id: user._id,
          username: user.username,
          role: user.role,
          token: generateToken(user._id, user.username, user.role),
        }
      });
    } catch (error) { next(error); }
  },

  // Đăng ký tài khoản (Public)
  register: async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const userExists = await User.findOne({ username });
      if (userExists) {
        return res.status(400).json({ status: "error", message: "Tên đăng nhập đã tồn tại" });
      }
      // Đăng ký public mặc định role là 'user'
      const user = await User.create({ username, password, role: 'user' });
      res.status(201).json({
        status: "success",
        data: {
          _id: user._id,
          username: user.username,
          role: user.role,
           token: generateToken(user._id, user.username, user.role),
        }
      });
    } catch (error) { next(error); }
  }
};

module.exports = userController;
