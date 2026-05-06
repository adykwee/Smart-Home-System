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
<<<<<<< Updated upstream
      const response = await axios.get(`${API_URL}/api/v1/devices`);
      setDevices(response.data);
=======
      const response = await apiClient.get('/devices');
      const data = response.data;
      setDevices(Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []));
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    setUpdatingId(device.id);

    try {
      await axios.post(`${API_URL}/api/v1/devices/control`, {
        id: device.id,
=======
    const deviceId = device._id || device.id;
    setUpdatingId(deviceId);

    try {
      await apiClient.post('/devices/control', {
        id: deviceId,
>>>>>>> Stashed changes
        feedKey: device.feed_key,
        trangThai: newStatus
      });

      // Cập nhật state nội bộ ngay lập tức để UX mượt
      setDevices(prev => prev.map(d =>
<<<<<<< Updated upstream
        d.id === device.id ? { ...d, current_status: newStatus } : d
=======
        (d._id || d.id) === deviceId ? { ...d, current_status: newStatus } : d
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      const res = await axios.patch(`${API_URL}/api/v1/devices/${id}`, editForm);
=======
      const res = await apiClient.put(`/devices/${id}`, editForm);
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      await axios.delete(`${API_URL}/api/v1/devices/${id}`);
=======
      await apiClient.delete(`/devices/${id}`);
>>>>>>> Stashed changes
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {devices.map((device) => (
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
<<<<<<< Updated upstream
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Loại thiết bị</label>
                    <select 
                      value={editForm.type}
                      onChange={(e) => setEditForm({...editForm, type: e.target.value})}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    >
                      <option value="Sensor">Sensor (Cảm biến)</option>
                      <option value="Actuator">Actuator (Điều khiển)</option>
                      <option value="Fan">Fan (Quạt)</option>
                      <option value="Light">Light (Đèn)</option>
                    </select>
                  </div>
=======
>>>>>>> Stashed changes
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
