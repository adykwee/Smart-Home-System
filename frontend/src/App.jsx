import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import DeviceStatus from "./pages/DeviceStatus";
import Devices from "./pages/Devices";
import Logs from "./pages/Logs";
import Thresholds from "./pages/Thresholds";
import Users from "./pages/Users";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { PageProvider } from "./contexts/PageContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Component bảo vệ Route
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Đang tải...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Component bảo vệ Route dành riêng cho Admin
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Đang tải...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <PageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="device-status" element={<DeviceStatus />} />
              <Route path="devices" element={<Devices />} />
              <Route path="logs" element={<Logs />} />
              <Route path="thresholds" element={<Thresholds />} />
              <Route path="users" element={<AdminRoute><Users /></AdminRoute>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </PageProvider>
    </AuthProvider>
  );
}

export default App;
