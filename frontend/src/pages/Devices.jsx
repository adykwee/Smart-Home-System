import { useState, useEffect } from "react";
import axios from "axios";
import {
  RefreshCw,
  LayoutGrid,
  Zap
} from "lucide-react";
import DeviceCard from "../components/DeviceCard";
import { usePage } from "../contexts/PageContext";

// Base URL từ env
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


export default function Devices() {
  const { setTitle } = usePage();

  useEffect(() => {
    setTitle("Thiết bị");
  }, [setTitle]);

  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchDevices = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await axios.get(`${API_URL}/api/v1/devices`);
      setDevices(response.data.data || response.data);
      setError(null);
    } catch (err) {
      console.error("Lỗi khi tải thiết bị:", err);
      setError("Không thể kết nối với máy chủ.");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();

    // Polling mỗi 3 giây theo yêu cầu USER
    const interval = setInterval(() => {
      fetchDevices(false);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleToggle = async (device) => {
    const newStatus = device.current_status === "ON" ? "OFF" : "ON";
    setUpdatingId(device._id);

    try {
      await axios.post(`${API_URL}/api/v1/devices/control`, {
        id: device._id,
        feedKey: device.feed_key,
        trangThai: newStatus
      });

      // Cập nhật state nội bộ ngay lập tức để UX mượt
      setDevices(prev => prev.map(d =>
        d._id === device._id ? { ...d, current_status: newStatus } : d
      ));
    } catch (err) {
      console.error("Lỗi điều khiển:", err);
      alert("Lỗi: Không thể thay đổi trạng thái thiết bị!");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading && devices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 gap-4">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="font-medium">Đang tải danh sách thiết bị...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {error ? (
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl text-rose-600 flex items-center gap-4">
          <div className="p-3 bg-rose-500 text-white rounded-2xl">
            <RefreshCw onClick={() => fetchDevices()} className="cursor-pointer" />
          </div>
          <div>
            <p className="font-bold">Đã xảy ra lỗi!</p>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {devices.map((device) => (
            <DeviceCard
              key={device._id}
              device={device}
              onToggle={handleToggle}
              isUpdating={updatingId === device._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
