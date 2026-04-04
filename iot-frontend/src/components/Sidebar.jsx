import { Link, useLocation } from 'react-router-dom';

function MenuItem({ to, icon, label }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <li className="nav-item mb-1">
      <Link 
        to={to} 
        className={`nav-link text-white d-flex align-items-center rounded ${isActive ? 'bg-primary' : ''}`}
        style={{ padding: '10px 15px', transition: '0.3s' }}
      >
        <span className="me-2">{icon}</span> {label}
      </Link>
    </li>
  );
}

export default function Sidebar() {
  return (
    // Dùng w-100 h-100 để lấp đầy 20% do App.jsx quy định
    <div className="d-flex flex-column text-white w-100 h-100" 
         style={{ backgroundColor: '#2a2f42' }}>
      
      <div className="p-3 border-bottom border-secondary d-flex align-items-center">
        <div className="bg-success rounded-circle me-2" style={{ width: '35px', height: '35px' }}></div>
        <span className="fs-5 fw-bold text-truncate">Smarthome App</span>
      </div>

      <ul className="nav nav-pills flex-column mb-auto p-3 overflow-hidden">
        <li className="nav-item mb-2 text-muted small fw-bold text-uppercase">Chính</li>
        <MenuItem to="/" icon="📊" label="Dashboard" />
        <MenuItem to="/thiet-bi" icon="⚙️" label="Thiết bị" />
        <MenuItem to="/nhat-ki" icon="📔" label="Nhật ký" />
        <MenuItem to="/lich-trinh" icon="📅" label="Lịch trình" />
        <MenuItem to="/canh-bao" icon="⚠️" label="Cảnh báo" />
        
        <li className="nav-item mb-2 mt-4 text-muted small fw-bold text-uppercase">Quản trị</li>
        <MenuItem to="/nguoi-dung" icon="👤" label="Người dùng" />
        <MenuItem to="/cai-dat" icon="🔧" label="Cài đặt" />
      </ul>

      <div className="p-3 m-2 rounded" style={{ backgroundColor: '#3b425d' }}>
        <div className="d-flex align-items-center mb-1">
          <span className="text-success me-2">●</span>
          <span className="small fw-bold text-success text-truncate">Hệ thống h.động</span>
        </div>
        <div className="small text-light ms-3 text-truncate">13 thiết bị online</div>
      </div>
      
    </div>
  );
}