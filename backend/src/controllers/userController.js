const userController = {
  // Lấy toàn bộ người dùng
  getAll: async (req, res, next) => {
    try {
      res.status(200).json({ status: "success", data: [] });
    } catch (error) { next(error); }
  },

  // Lấy 1 người dùng theo ID
  getById: async (req, res, next) => {
    try {
      res.status(200).json({ status: "success", data: {} });
    } catch (error) { next(error); }
  },

  // Tạo mới người dùng
  create: async (req, res, next) => {
    try {
      res.status(201).json({ status: "success", data: {} });
    } catch (error) { next(error); }
  },

  // Cập nhật người dùng
  update: async (req, res, next) => {
    try {
      res.status(200).json({ status: "success", data: {} });
    } catch (error) { next(error); }
  },

  // Xóa người dùng
  delete: async (req, res, next) => {
    try {
      res.status(200).json({ status: "success", message: "Deleted" });
    } catch (error) { next(error); }
  }
};

module.exports = userController;
