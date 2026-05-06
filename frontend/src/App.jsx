import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import DeviceStatus from "./pages/DeviceStatus";
import Devices from "./pages/Devices";
import Logs from "./pages/Logs";
import Schedules from "./pages/Schedules";
import Alerts from "./pages/Alerts";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
<<<<<<< Updated upstream
import { PageProvider } from "./contexts/PageContext";

function App() {
  return (
    <PageProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="device-status" element={<DeviceStatus />} />
          <Route path="devices" element={<Devices />} />
          <Route path="logs" element={<Logs />} />
          <Route path="schedules" element={<Schedules />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </PageProvider>
);
=======
import Login from "./pages/Login";
import { PageProvider } from "./contexts/PageContext";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <PageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<PrivateRoute />}>
              <Route element={<MainLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="device-status" element={<DeviceStatus />} />
                <Route path="devices" element={<Devices />} />
                <Route path="logs" element={<Logs />} />
                <Route path="schedules" element={<Schedules />} />
                <Route path="alerts" element={<Alerts />} />
                <Route path="users" element={<Users />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </PageProvider>
    </AuthProvider>
  );
>>>>>>> Stashed changes
}

export default App;
