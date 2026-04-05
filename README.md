# Hệ Thống Nhà Thông Minh (Smart Home System)

Dự án Hệ thống quản lý Smart Home xây dựng dựa trên kiến trúc tiên tiến phân tách rõ Frontend (React/Vite) và Backend (Node.js/Express) với ngôn ngữ cơ sở dữ liệu PostgreSQL.

## 1. Cấu Trúc Mã Nguồn (Project Structure)
Dự án được ứng dụng chuẩn kiến trúc **MVC** (Model - View - Controller) cho Backend và kiến trúc **Component-based** ánh xạ theo sơ đồ Figma cho Frontend.

### Backend (`/backend`)
Được thiết kế xoay quanh 6 Bảng CSDL cốt lõi (Table-driven design). Mọi Logic truy vấn và API đều đi qua mô hình chuẩn này:
- `src/models/`: Nơi chứa 6 Modules đại diện cho 6 bảng tương tác Database (sử dụng thư viện lệnh `pg`). Gồm: `userModel`, `deviceModel`, `sensorDataModel`, `systemLogModel`, `scheduleModel`, `thresholdModel`.
- `src/controllers/`: Bộ điều hướng xử lý logic tiếp nhận (Của 6 module trên) để quyết định xuất ra kết quả API trả về cho Frontend.
- `src/routes/`: Bản đồ URL đường dẫn truy cập (vd: `/api/v1/devices`). Tại tệp `index.js` đã gộp thành ngữ cảnh chuẩn `/api/v1/...`
- `src/services/` & `src/middlewares/`: Nơi chứa trình chạy ngầm (cron_job) cho **Schedule**, trình đánh giá cảnh báo **AlertEngine**, kèm check Auth (bảo vệ Token JWT) và RateLimit.

### Frontend (`/frontend`)
Giao diện bám quyền thiết kế Figma:
- `src/pages/`: Có chính xác 8 giao diện rỗng độc lập tương ứng 8 thanh điều hướng (Dashboard, DeviceStatus, Schedules, Alerts...).
- `src/layouts/MainLayout.jsx`: Chứa Sidebar tĩnh và Topbar khung admin tiêu chuẩn.
- Giao tiếp dữ liệu qua `axios` ở `src/services/api.js`.

---

## 2. Hướng Dẫn Cài Đặt Khởi Chạy (Getting Started)

### Môi trường khuyến nghị:
- **Node.js**: >= 18.x
- **PostgreSQL**: >= 15.0

### Bước 1: Setup Dữ liệu (PostgreSQL)
1. Mở PGAdmin hoặc terminal SQL tạo CSDL mang tên `smart_home_db`.
2. Import tệp thiết kế `smart_home_db.sql` bên ngoài vào hệ thống PostgreSQL để khởi tạo 6 bảng tiêu chuẩn.

### Bước 2: Setup Backend
Mở một cửa sổ Terminal (hoặc cmd):
```bash
cd backend
npm install

# Đổi đuôi tệp thành .env, cấu hình tham số:
cp .env.example .env
# (Thay đoạn DATABASE_URL=postgresql://root:password123@localhost:5432/smart_home_db thành cấu hình cá nhân)

# Bật máy chủ kết nối
npm run dev
```

### Bước 3: Setup Frontend
Mở cửa sổ Terminal thứ hai:
```bash
cd frontend
npm install
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
