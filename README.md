# Smart Home Dashboard (Hệ Thống Quản Lý Nhà Thông Minh)

Một ứng dụng Full-stack IoT cho phép giám sát cảm biến và điều khiển các thiết bị trong nhà (đèn, quạt, khóa cửa, camera) theo thời gian thực (Real-time). Hệ thống hỗ trợ đồng bộ dữ liệu 2 chiều giữa Web, Database và Mạch phần cứng thông qua giao thức MQTT.

---

## Công Nghệ Sử Dụng

**1. Tầng Frontend (Giao diện người dùng)**
- **React.js:** Thư viện xây dựng giao diện UI/UX linh hoạt.
- **Bootstrap 5:** Framework CSS để thiết kế giao diện Responsive, tự động tương thích trên cả PC và điện thoại.
- **Axios:** Xử lý các HTTP Request để giao tiếp với Backend.

**2. Tầng Backend (Xử lý logic & API)**
- **Node.js & Express.js:** Xây dựng máy chủ Web và RESTful API.
- **MySQL2:** Thư viện kết nối và thao tác với cơ sở dữ liệu quan hệ MySQL.
- **MQTT (mqtt.js):** Giao thức nhắn tin Publish/Subscribe siêu nhẹ, lý tưởng cho IoT.
- **Dotenv:** Bảo mật các thông tin nhạy cảm (API Keys, Database config).

**3. Tầng Cơ Sở Dữ Liệu & Cloud**
- **MySQL (XAMPP):** Lưu trữ danh sách thiết bị, lịch sử hoạt động và dữ liệu cảm biến.
- **Adafruit IO:** Nền tảng Cloud trung gian (MQTT Broker) để truyền tải tín hiệu điều khiển xuống vi điều khiển (ESP32/ESP8266).

---

## Cấu Trúc Dự Án (Project Structure)

Dự án được chia thành 2 module độc lập để dễ quản lý và mở rộng:

```text
Smart-Home-Project/
│
├── backend/                   # ⚙️ MÃ NGUỒN BACKEND (Node.js)
│   ├── node_modules/          
│   ├── .env                   # Chứa cấu hình bảo mật (Mật khẩu DB, Adafruit Key) - KHÔNG PUSH LÊN GIT
│   ├── .gitignore             # Bỏ qua node_modules và .env
│   ├── package.json           # Danh sách thư viện Backend
│   └── server.js              # File khởi chạy Server chính (Xử lý API & MQTT)
│
├── frontend/                  # 💻 MÃ NGUỒN FRONTEND (React.js)
│   ├── node_modules/          
│   ├── public/                
│   ├── src/                   
│   │   ├── components/        # Các UI Components tái sử dụng (VD: DeviceCard.jsx)
│   │   ├── pages/             # Các trang hiển thị chính (VD: Devices.jsx)
│   │   └── App.jsx            # File gốc của React
│   ├── .gitignore             
│   └── package.json           # Danh sách thư viện Frontend
│
└── README.md                  # Tài liệu hướng dẫn dự án

## ⚙️ Yêu cầu hệ thống
*Đã cài đặt Node.js (Phiên bản 14.x trở lên).
*Đã cài đặt XAMPP hoặc MySQL Server.
*Có tài khoản Adafruit IO.

## ⚙️ Hướng dẫn cài đặt và khởi chạy

# Thiết lập Backend
1. Mở Terminal tại thư mục backend/ 
2. Cài đặt thư viện: npm install 
3. Chỉnh sửa .env: 
      PORT=3000
      DB_HOST=localhost
      DB_USER=root
      DB_PASSWORD=
      DB_NAME=smart_home_db
      ADAFRUIT_USERNAME=tên_user_của_bạn
      ADAFRUIT_KEY=key_adafruit_của_bạn
4. Chạy Server: node server.js


# Thiết lập Frontend
1. Mở Terminal mới tại thư mục frontend/. 
2. Cài đặt thư viện: npm install
3. Khởi chạy ứng dụng: npm run dev
