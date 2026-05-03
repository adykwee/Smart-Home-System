# Design Patterns trong Smart Home System

Tài liệu này trình bày các **Mẫu thiết kế (Design Patterns)** đã được áp dụng trong dự án, đáp ứng trực tiếp yêu cầu chấm điểm của Tuần 19. Việc áp dụng các mẫu thiết kế này giúp hệ thống dễ bảo trì, dễ mở rộng và tách biệt trách nhiệm rõ ràng.

---

## 1. Singleton Pattern
**Mục đích:** Đảm bảo chỉ có duy nhất một thể hiện (instance) của class/object được tạo ra trong suốt vòng đời của ứng dụng.
**Vị trí áp dụng:** 
- `backend/src/config/database.js` (Kết nối Mongoose)
- `backend/src/config/mqtt.js` (Kết nối MQTT Client)
**Lý do & Lợi ích:**
- **Tiết kiệm tài nguyên**: Thay vì mỗi module đều khởi tạo một kết nối mới tới MongoDB hoặc Adafruit IO (gây cạn kiệt số lượng connection pool), Singleton đảm bảo toàn bộ backend chỉ dùng chung 1 kết nối duy nhất.
- **Quản lý state tập trung**: Dễ dàng lắng nghe các sự kiện `connect`, `error`, `message` tập trung tại một nơi.

---

## 2. Factory Pattern
**Mục đích:** Tạo ra một interface để khởi tạo đối tượng, nhưng để các lớp con (hoặc logic bên trong) quyết định lớp nào sẽ được tạo.
**Vị trí áp dụng:**
- `backend/src/factories/DeviceFactory.js`
**Lý do & Lợi ích:**
- Khi hệ thống nhận được dữ liệu từ một Feed hoàn toàn mới thông qua MQTT, hệ thống cần tự động đăng ký thiết bị đó vào Database (Auto-discovery).
- Tùy vào chuỗi `feed_key` (chứa từ khóa "sensor", "led", "fan"), `DeviceFactory` sẽ tự động phân loại đây là `Sensor` hay `Actuator` và gán tên mặc định phù hợp.
- **Mở rộng dễ dàng**: Khi thêm loại thiết bị mới (như rèm cửa, camera), chỉ cần thêm logic phân loại vào Factory mà không phải sửa đổi code ở `server.js`.

---

## 3. Strategy Pattern
**Mục đích:** Định nghĩa một tập hợp các thuật toán (hoặc quy tắc), đóng gói từng thuật toán lại và làm cho chúng có thể thay thế lẫn nhau.
**Vị trí áp dụng:**
- `backend/src/services/alertEngine.js`
**Lý do & Lợi ích:**
- Hệ thống có chức năng cảnh báo khi giá trị cảm biến vượt ngưỡng (`Thresholds`). Các quy tắc kiểm tra rất đa dạng: Kiểm tra vượt Max (`MaxThresholdStrategy`), kiểm tra dưới Min (`MinThresholdStrategy`), hoặc tương lai có thể là kiểm tra biến thiên đột ngột.
- Thay vì sử dụng hàng loạt câu lệnh `if-else` lồng nhau phức tạp trong `server.js`, ta tách mỗi quy tắc thành một Strategy độc lập (Implement interface `AlertStrategy`).
- **Mở rộng dễ dàng**: Khi cần bổ sung quy tắc mới, chỉ việc tạo thêm class `NewStrategy` và nạp vào mảng chiến lược của `AlertContext` mà không cần đụng đến logic cũ.

---

## 4. Repository Pattern
**Mục đích:** Tạo một lớp trung gian giữa Data Access Layer (Mongoose/MongoDB) và Business Logic Layer (Controllers/Services).
**Vị trí áp dụng:**
- `backend/src/repositories/DeviceRepository.js`
- `backend/src/repositories/SystemLogRepository.js`
**Lý do & Lợi ích:**
- Code của `server.js` hoặc `deviceController.js` không cần quan tâm đến cú pháp cụ thể của MongoDB (`findById`, `updateOne`, `create`). Chúng chỉ gọi các hàm nghiệp vụ như `deviceRepo.updateStatus()`, `systemLogRepo.createLog()`.
- **Dễ bảo trì và Test**: Nếu tương lai hệ thống muốn đổi từ MongoDB sang PostgreSQL hoặc MySQL, ta chỉ cần viết lại các class Repository, hoàn toàn không phải sửa đổi Controller hay Business Logic.

---

## 5. Observer Pattern (Mở rộng kiến trúc)
**Mục đích:** Định nghĩa mối phụ thuộc 1-Nhiều giữa các đối tượng để khi một đối tượng thay đổi trạng thái, tất cả những đối tượng phụ thuộc nó đều được thông báo.
**Vị trí áp dụng:**
- Sử dụng `Socket.IO` trong `server.js` và React Frontend (`DeviceStatus.jsx`).
- Sử dụng `MQTT Client` lắng nghe từ Broker.
**Lý do & Lợi ích:**
- `Socket.IO` server đóng vai trò là Subject. Các trình duyệt (Web client) đang mở trang Dashboard là các Observers.
- Khi có tin nhắn MQTT mới, Backend không cần chờ Web request tới, nó chủ động đẩy (emit) sự kiện `realtime_data` hoặc `alert` tới tất cả các Observers đang subscribe.
- **Lợi ích**: Tạo ra trải nghiệm Real-time thực thụ (Module 5), giám sát dữ liệu cảm biến liên tục không có độ trễ do Polling.
