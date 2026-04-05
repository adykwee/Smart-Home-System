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

function App() {
  return (
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
  );
}

export default App;
