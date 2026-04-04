export default function DeviceCard({ device, onToggle }) {
  // 1. Kiểm tra trạng thái 
  const isOn = device.current_status === 'ON';

  // 2. Hàm tự render icon dựa vào type
  const renderIcon = (type) => {
    switch (type) {
      case 'Light': return '💡';
      case 'Fan': return '🌀';
      case 'Lock': return '🔒';
      case 'Camera': return '📹';
      default: return device.name ? device.name.charAt(0).toUpperCase() : '?'; 
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-4 mb-4">
      <div className="card-body p-3 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <div 
            className={`rounded-4 d-flex justify-content-center align-items-center me-3 ${isOn ? 'bg-primary text-white' : 'bg-secondary bg-opacity-25 text-secondary'}`}
            style={{ width: '55px', height: '55px', fontSize: '1.5rem', transition: '0.3s' }}
          >
            {renderIcon(device.type)}
          </div>
          
          <div className="d-flex flex-column">
            <span className="fw-bold fs-5">{device.name}</span>
            <span className="text-muted small mb-1">{device.room}</span>
            <div>
              <span className={`badge ${isOn ? 'bg-primary' : 'bg-secondary'}`}>
                {isOn ? 'Đang bật' : 'Đã tắt'}
              </span>
            </div>
          </div>
        </div>

        {/* NỬA PHẢI: Nút gạt Toggle */}
        <div className="form-check form-switch fs-2 m-0 pe-2">
          <input 
            className="form-check-input" 
            type="checkbox" 
            role="switch" 
            style={{ cursor: 'pointer' }}
            // Phải có checked và onChange đồng bộ với nhau
            checked={isOn} 
            onChange={() => onToggle(device.id)}
          />
        </div>

      </div>
    </div>
  );
}