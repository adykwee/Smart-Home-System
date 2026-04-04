import { useLocation } from 'react-router-dom';

export default function Header() {
  // Lấy đường dẫn hiện tại của trình duyệt (URL)
  const location = useLocation();
  
  // Tạo một "cuốn từ điển" để map URL thành Tên trang tương ứng
  const pageTitles = {
    '/': 'Trang Tổng quan (Dashboard)',
    '/thiet-bi': 'Quản lý Thiết bị',
    '/nhat-ki': 'Nhật ký Hoạt động',
    '/lich-trinh': 'Cài đặt Lịch trình',
    '/canh-bao': 'Cảnh báo Hệ thống',
    '/nguoi-dung': 'Quản lý Người dùng',
    '/cai-dat': 'Cài đặt Hệ thống'
  };

  // Tra cứu tên trang, nếu kẹt ở URL lạ thì hiển thị chữ mặc định
  const currentTitle = pageTitles[location.pathname] || 'Trang chủ quản trị';

  return (
    <header className="p-3 text-white d-flex justify-content-between align-items-center w-100 h-100" 
            style={{ backgroundColor: '#2d54aa' }}>
            
      {/* Hiển thị tên trang động vào đây */}
      <h4 className="m-0 fw-bold">{currentTitle}</h4>
      
      <div className="d-flex align-items-center">
        <span className="me-4 fs-5" style={{ cursor: 'pointer' }}>🔔</span>
        
        <div className="d-flex align-items-center me-4">
          <div className="rounded-circle bg-light text-dark d-flex justify-content-center align-items-center fw-bold me-2" 
               style={{ width: '35px', height: '35px' }}>
            AD
          </div>
          <div className="d-flex flex-column" style={{ lineHeight: '1.2' }}>
            <span className="fw-bold">Admin</span>
            <span style={{ fontSize: '0.75rem' }}>Quản trị viên</span>
          </div>
        </div>
        
        <button className="btn btn-outline-light border-0 text-danger fw-bold d-flex align-items-center">
          <span className="me-2">↪</span> Đăng xuất
        </button>
      </div>
      
    </header>
  );
}