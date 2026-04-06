# Hệ Thống Nhà Thông Minh (Smart Home System)

Dự án Hệ thống quản lý Smart Home xây dựng dựa trên kiến trúc tiên tiến phân tách rõ Frontend (React/Vite) và Backend (Node.js/Express) với ngôn ngữ cơ sở dữ liệu MySQL (XAMPP).

## 1. Cấu Trúc Mã Nguồn (Project Structure)
Dự án được ứng dụng chuẩn kiến trúc **MVC** (Model - View - Controller) cho Backend và kiến trúc **Component-based** cho Frontend.

```text
Smart-Home-System/
├── backend/                       # RESTful API Server (Node.js/Express)
│   ├── src/
│   │   ├── models/                # Logic tương tác Database MySQL (của 6 bảng cốt lõi)
│   │   ├── controllers/           # Xử lý logic nghiệp vụ và điều hướng API 
│   │   ├── routes/                # Bản đồ URL của API (vd: /api/v1/devices)
│   │   └── services/ & middlewares/  # Cron_job, AlertEngine, Auth (JWT), RateLimit
│   └── .env                       # Cấu hình CSDL
└── frontend/                      # Giao diện người dùng (React/Vite)
    ├── src/
    │   ├── pages/                 # 8 Giao diện rỗng bám sát Figma (Dashboard, Devices,...)
    │   ├── layouts/               # Khung chung (Sidebar, Topbar)
    │   └── services/api.js        # File cấu hình Axios gửi Request xuống Backend
```

---

## 2. Hướng Dẫn Cài Đặt Khởi Chạy (Getting Started)

### Môi trường khuyến nghị:
- **Node.js**: >= 18.x
- **XAMPP** (có kèm MySQL/MariaDB cài sẵn)

### Bước 1: Setup Dữ liệu (MySQL qua XAMPP)
1. Bật **Apache** và **MySQL** trên bảng điều khiển của XAMPP Control Panel.
2. Truy cập vào phpMyAdmin qua trình duyệt: http://localhost/phpmyadmin
3. Tạo CSDL mang tên `smart_home_db`.
4. Import tệp thiết kế `smart_home_db.sql` bên ngoài vào hệ thống MySQL để khởi tạo 6 bảng tiêu chuẩn.

### Bước 2: Setup Backend
Mở một cửa sổ Terminal (hoặc cmd):
```bash
cd backend
npm install

# Đổi đuôi tệp thành .env, cấu hình tham số:
cp .env.example .env
# (Lưu ý: Mặc định XAMPP sử dụng user 'root' và password rỗng. Các file cấu hình đã được thiết lập sẵn)

# Bật máy chủ kết nối
npm run dev
```

### Bước 3: Setup Frontend
Mở cửa sổ Terminal thứ hai:
```bash
cd frontend
npm install

# Đổi đuôi tệp thành .env:
cp .env.example .env

npm run dev
```
Trang web sẽ hiện diện khởi động trên localhost URL tương ứng.

---

## 3. Quy Trình Làm Việc Nhóm Với Git (Git Workflow - Sử dụng Rebase)

Để dự án làm nhóm không bị rối loạn Git Graph (biến thành mạng nhện), chúng ta sẽ tuân thủ nguyên tắc không sử dụng Merge để cập nhật code cá nhân mà dùng **Git Rebase**.

### Sơ đồ nhánh:
- `main` / `master`: Code Product hoàn chỉnh nhất (Không được phép push thẳng).
- `dev`: Nhánh gộp code phát triển chung của team (Trực tiếp tạo nhánh nhánh tính năng từ đây).
- `feature/*` (vd: `feature/tao-trang-logs`): Nhánh tính năng cá nhân.

### Luồng làm việc (Quy trình tiêu chuẩn 5 bước):

**Bước 1: Cập nhật nhánh dev mới nhất từ remote**
Luôn kéo code mới nhất về trước khi code rẽ nhánh để tránh lỗi xa:
```bash
git checkout dev
git pull origin dev
```

**Bước 2: Tạo nhánh tính năng của bạn**
```bash
git checkout -b feature/tên_chức_năng_của_bạn
# Vd: git checkout -b feature/ui-devices
```

**Bước 3: Viết code và Commit**
Làm việc trên local và commit thông điệp rõ ràng:
```bash
git add .
git commit -m "feat: Xây dựng giao diện trang Devices"
git commit -m "fix: Sửa lỗi load trục trặc API ở Devices"
```

**Bước 4: CẬP NHẬT CODE ĐỒNG ĐỘI & REBASE (BẮT BUỘC)**
Trước khi đẩy code của bạn lên và xin tạo Pull Request (PR), có thể những thành viên khác trong nhóm đã push code mới vào nhánh `dev`. Bạn phải mang cái code mới đó làm cái "đế" chèn xuống phần code của bạn.

```bash
# 1. Tải dữ liệu mới nhất trên Origin về máy tĩnh
git fetch origin

# 2. Xóa đế cũ đi và đẩy nhánh dev mới nhất làm nền cho những commit của bạn
git rebase origin/dev

## MẸO Nếu có Xung đột (Conflict): 
# - Bạn rà soát file bị conflict (VSCode sẽ báo đỏ).
# - Chọn Accept Current hoặc Accept Incoming cho đúng logic code chạy được.
# - Sau đó gõ tiếp lệnh:
# git add <các file vừa fix>
# git rebase --continue
```

**Bước 5: Push lên Remote và Tạo PR**
Lưu ý do rebase đã viết lại bộ xương (history), Git sẽ đánh dấu là lịch sử cây chênh lệch, bạn bắt buộc phải dùng lệnh Đẩy ép buộc (Force push):

```bash
git push -f origin feature/tên_chức_năng_của_bạn
```

-> Lên Github tạo Pull Request (PR) gộp vào nhánh `dev` và gọi đồng đội review code! Lịch sử gộp lúc này sẽ nằm trên 1 đường thẳng tắp cực kì rõ ràng.
