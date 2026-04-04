import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'; 

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Devices from './pages/Devices';
import Logs from './pages/Logs';
import Schedules from './pages/Schedules';
import Alerts from './pages/Alerts';

function App() {
  return (
    <BrowserRouter>
      {/* KHUNG TỔNG: Chiếm 100% chiều cao (vh-100) và 100% chiều rộng (vw-100) màn hình */}
      <div className="d-flex vh-100 vw-100 overflow-hidden" style={{ backgroundColor: '#e9ecef' }}>
        
        {/* ======================================= */}
        {/* CỘT TRÁI (SIDEBAR): CHIẾM ĐÚNG 20% RỘNG */}
        {/* ======================================= */}
        <div style={{ width: '20%', height: '100%' }}>
          <Sidebar />
        </div>

        {/* ======================================= */}
        {/* CỘT PHẢI: CHIẾM ĐÚNG 80% RỘNG           */}
        {/* ======================================= */}
        <div className="d-flex flex-column" style={{ width: '80%', height: '100%' }}>
          
          {/* HEADER PhÍa TRÊn: CHIẾM ĐÚNG 15% CHIỀU CAO */}
          <div style={{ height: '10%' }}>
            <Header />
          </div>

          {/* NỘI DUNG CHÍNH (PAGES): CHIẾM 85% CÒN LẠI */}
          <div className="p-4 overflow-auto" style={{ height: '85%' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/thiet-bi" element={<Devices />} />
              <Route path="/lich-trinh" element={<Schedules />} />
              <Route path="/nhat-ki" element={<Logs />} />
              <Route path="/canh-bao" element={<Alerts />} />
            </Routes>
          </div>
          
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;