const authenticate = (req, res, next) => {
  // Đọc Token từ headers
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ status: "error", message: "Yêu cầu đăng nhập!" });
  }

  // Logic xác thực token (vd: JWT, verify đối chiếu bảng `users`).
  // ...

  // Lưu thông tin người dùng vào req để router sau sử dụng
  // req.user = decodedToken;
  next();
}

module.exports = authenticate;
