import { useState, useEffect } from 'react'; // <-- Thêm useEffect ở đây
import axios from 'axios';
import DeviceCard from '../components/DeviceCard';

export default function Devices() {
  // Vẫn giữ khung danh sách ban đầu
  const [deviceList, setDeviceList] = useState([
    { id: 1, feed_key: 'device-1', name: 'Đèn phòng khách', room: 'Phòng khách', type: 'Light', current_status: 'OFF' },
    { id: 2, feed_key: 'device-2', name: 'Đèn phòng ngủ', room: 'Phòng ngủ', type: 'Light', current_status: 'OFF' },
    { id: 3, feed_key: 'device-3', name: 'Quạt trần', room: 'Phòng khách', type: 'Fan', current_status: 'OFF' },
    { id: 4, feed_key: 'device-4', name: 'Khóa cửa chính', room: 'Cổng', type: 'Lock', current_status: 'OFF' },
    { id: 5, feed_key: 'device-5', name: 'Camera an ninh', room: 'Sân trước', type: 'Camera', current_status: 'OFF' },
  ]);

  // ==========================================
  // EFFECT: TỰ ĐỘNG CHẠY KHI VỪA VÀO TRANG
  // ==========================================
  useEffect(() => {
      const fetchDeviceStatus = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/devices');
          const dbStatus = response.data; 

          setDeviceList(prevList => 
            prevList.map(device => {
              const serverDevice = dbStatus.find(d => d.id === device.id);
              return serverDevice ? { ...device, current_status: serverDevice.current_status } : device;
            })
          );
        } catch (error) {
          console.error("Lỗi đồng bộ:", error);
        }
      };

      // 1. Chạy ngay lần đầu tiên mở web
      fetchDeviceStatus();

      // 2. Cứ mỗi 3 giây (3000ms) lại lén hỏi Server xem có gì mới không
      const intervalId = setInterval(fetchDeviceStatus, 3000);

      // 3. Dọn dẹp bộ đếm khi chuyển sang trang khác
      return () => clearInterval(intervalId);
    }, []); // Vẫn giữ mảng rỗng

  const handleToggle = async (deviceId) => {
    const deviceToUpdate = deviceList.find(d => d.id === deviceId);
    if (!deviceToUpdate) return;

    // QUAN TRỌNG: Đổi status thành current_status cho khớp DB
    const newStatus = deviceToUpdate.current_status === 'ON' ? 'OFF' : 'ON';

    setDeviceList(prevList => 
      prevList.map(device => 
        device.id === deviceId ? { ...device, current_status: newStatus } : device
      )
    );

    try {
      // GỬI ĐÚNG TÊN BIẾN MÀ BACKEND ĐANG ĐỢI
      await axios.post('http://localhost:3000/api/device/control', {
        id: deviceId,               // Gửi số (1, 2, 3...)
        feedKey: deviceToUpdate.feed_key, // Gửi chuỗi (device-1...)
        trangThai: newStatus        // Gửi 'ON'/'OFF'
      });
      console.log(`Đã gửi lệnh ${newStatus} cho thiết bị ID: ${deviceId}`);
    } catch (error) {
      console.error("Lỗi khi điều khiển thiết bị:", error);
      // Rollback nếu lỗi
      setDeviceList(prevList => 
        prevList.map(device => 
          device.id === deviceId ? { ...device, current_status: deviceToUpdate.current_status } : device
        )
      );
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="text-secondary fw-bold m-0">Quản lý Thiết bị trong nhà</h5>
      </div>
      <div className="row">
        {deviceList.map((device) => (
          <div className="col-md-6" key={device.id}>
            <DeviceCard device={device} onToggle={handleToggle} />
          </div>
        ))}
      </div>
    </div>
  );
}