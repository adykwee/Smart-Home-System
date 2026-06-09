import { useState, useEffect } from "react";
import apiClient from "../services/api";
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
    setTitle("Quản lý thiết bị");
  }, [setTitle]);

  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchDevices = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await apiClient.get('/devices');
      const data = response.data;
      setDevices(Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []));
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
    const deviceId = device._id || device.id;
    setUpdatingId(deviceId);

    try {
      await apiClient.post('/devices/control', {
        id: deviceId,
        feedKey: device.feed_key,
        trangThai: newStatus
      });

      // Cập nhật state nội bộ ngay lập tức để UX mượt
      setDevices(prev => prev.map(d =>
        (d._id || d.id) === deviceId ? { ...d, current_status: newStatus } : d
      ));
    } catch (err) {
      console.error("Lỗi điều khiển:", err);
      alert("Lỗi: Không thể thay đổi trạng thái thiết bị!");
    } finally {
      setUpdatingId(null);
    }
  };

  const [editingDevice, setEditingDevice] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', room: '', type: '' });

  const handleEdit = (device) => {
    setEditingDevice(device);
    setEditForm({
      name: device.name,
      room: device.room || '',
      type: device.type
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const id = editingDevice._id || editingDevice.id;
    try {
      const res = await apiClient.put(`/devices/${id}`, editForm);
      setDevices(prev => prev.map(d => (d._id || d.id) === id ? res.data.data : d));
      setEditingDevice(null);
    } catch (err) {
      console.error("Lỗi khi cập nhật thiết bị:", err);
      alert("Không thể cập nhật thiết bị!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa thiết bị này khỏi hệ thống?")) return;
    
    try {
      await apiClient.delete(`/devices/${id}`);
      setDevices(prev => prev.filter(d => (d._id || d.id) !== id));
    } catch (err) {
      console.error("Lỗi khi xóa thiết bị:", err);
      alert("Không thể xóa thiết bị. Vui lòng thử lại!");
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
        <>
          <div className="space-y-10">
            {devices.filter(d => d.type === "Sensor").length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-xl">
                    <LayoutGrid className="w-5 h-5 text-indigo-600" />
                  </div>
                  Cảm biến
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {devices.filter(d => d.type === "Sensor").map((device) => (
                    <DeviceCard
                      key={device._id || device.id}
                      device={device}
                      onToggle={handleToggle}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                      isUpdating={updatingId === (device._id || device.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {devices.filter(d => d.type !== "Sensor").length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-xl">
                    <Zap className="w-5 h-5 text-amber-600" />
                  </div>
                  Quạt & Đèn
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {devices.filter(d => d.type !== "Sensor").map((device) => (
                    <DeviceCard
                      key={device._id || device.id}
                      device={device}
                      onToggle={handleToggle}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                      isUpdating={updatingId === (device._id || device.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {devices.length === 0 && (
              <div className="flex flex-col items-center justify-center min-h-[200px] text-slate-400 gap-4">
                <p className="font-medium">Chưa có thiết bị nào trong hệ thống.</p>
              </div>
            )}
          </div>

          {/* Edit Modal */}
          {editingDevice && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-300">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">Chỉnh sửa thiết bị</h3>
                <form onSubmit={handleUpdate} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Tên thiết bị</label>
                    <input 
                      type="text" 
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="VD: Cảm biến phòng khách"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Phòng</label>
                    <input 
                      type="text" 
                      value={editForm.room}
                      onChange={(e) => setEditForm({...editForm, room: e.target.value})}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="VD: Phòng khách, Ban công..."
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button 
                      type="button"
                      onClick={() => setEditingDevice(null)}
                      className="flex-1 py-3 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors"
                    >
                      Hủy
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-3 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
                    >
                      Lưu thay đổi
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
