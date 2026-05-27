import { useState, useEffect } from "react";
import apiClient from "../services/api";
import {
  Clock,
  Plus,
  Trash2,
  Power,
  RefreshCw,
  Calendar,
  Zap,
  ZapOff
} from "lucide-react";
import { usePage } from "../contexts/PageContext";

export default function Schedules() {
  const { setTitle } = usePage();

  useEffect(() => {
    setTitle("Quản lý lịch trình");
  }, [setTitle]);

  const [schedules, setSchedules] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    device_id: '',
    schedule_type: 'daily',
    time_on: '08:00',
    time_off: '17:00',
    trigger_date: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [scheduleRes, deviceRes] = await Promise.all([
        apiClient.get('/schedules'),
        apiClient.get('/devices')
      ]);
      setSchedules(scheduleRes.data?.data || []);
      
      const allDevices = deviceRes.data?.data || [];
      setDevices(allDevices.filter(d => d.type !== 'Sensor'));
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await apiClient.put(`/schedules/${id}`, { is_active: !currentStatus });
      setSchedules(prev => prev.map(s => 
        (s._id || s.id) === id ? { ...s, is_active: !currentStatus } : s
      ));
    } catch (err) {
      console.error("Lỗi update lịch trình:", err);
      alert("Không thể cập nhật trạng thái");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa lịch trình này?")) return;
    try {
      await apiClient.delete(`/schedules/${id}`);
      setSchedules(prev => prev.filter(s => (s._id || s.id) !== id));
    } catch (err) {
      console.error("Lỗi xóa lịch trình:", err);
      alert("Không thể xóa lịch trình");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.device_id) {
      alert("Vui lòng chọn thiết bị");
      return;
    }
    if (formData.schedule_type === 'once' && !formData.trigger_date) {
      alert("Vui lòng chọn ngày cho lịch 1 lần");
      return;
    }
    if (!formData.time_on || !formData.time_off) {
      alert("Vui lòng nhập cả giờ bật và giờ tắt");
      return;
    }

    try {
      setSubmitting(true);
      const res = await apiClient.post('/schedules', formData);
      setSchedules(prev => [res.data.data, ...prev]);
      setShowModal(false);
      // Reset form
      setFormData({
        device_id: devices.length > 0 ? devices[0]._id : '',
        schedule_type: 'daily',
        time_on: '08:00',
        time_off: '17:00',
        trigger_date: ''
      });
    } catch (err) {
      console.error("Lỗi tạo lịch trình:", err);
      alert("Không thể tạo lịch trình");
    } finally {
      setSubmitting(false);
    }
  };

  const getDeviceName = (id) => {
    const d = devices.find(dev => (dev._id || dev.id) === id);
    return d ? d.name : 'Thiết bị không xác định';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 gap-4">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="font-medium">Đang tải lịch trình...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Danh sách lịch hẹn</h2>
          <p className="text-slate-500 text-sm mt-1">Hệ thống sẽ tự động điều khiển Bật và Tắt thiết bị</p>
        </div>
        <button
          onClick={() => {
            if (devices.length > 0 && !formData.device_id) {
              setFormData({ ...formData, device_id: devices[0]._id || devices[0].id });
            }
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-2xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
        >
          <Plus size={20} />
          <span>Thêm lịch</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schedules.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-3xl border border-slate-100 border-dashed">
            <Clock className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Chưa có lịch trình nào được thiết lập</p>
          </div>
        ) : (
          schedules.map((schedule) => {
            const isDaily = schedule.schedule_type === 'daily';
            const isActive = schedule.is_active;

            return (
              <div 
                key={schedule._id || schedule.id} 
                className={`bg-white rounded-[2rem] p-6 shadow-sm border ${isActive ? 'border-indigo-100 shadow-indigo-100' : 'border-slate-100 opacity-70'} transition-all relative overflow-hidden group flex flex-col h-full`}
              >
                {/* Status Indicator */}
                <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl ${isActive ? 'from-emerald-400 to-emerald-500' : 'from-slate-300 to-slate-400'} opacity-20 rounded-bl-full`} />
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 line-clamp-1 pr-4">
                      {getDeviceName(schedule.device_id)}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-3 py-1 text-xs font-bold rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                        {isDaily ? 'Hàng ngày' : 'Một lần'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleActive(schedule._id || schedule.id, isActive)}
                    className={`p-3 rounded-2xl transition-colors shrink-0 ${
                      isActive ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                    }`}
                    title={isActive ? "Tắt lịch này" : "Bật lịch này"}
                  >
                    <Power size={24} />
                  </button>
                </div>

                <div className="flex-1 space-y-3 mb-6">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 border border-amber-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-200 text-amber-700 rounded-xl">
                        <Zap size={18} />
                      </div>
                      <p className="text-sm font-semibold text-amber-900">Giờ bật</p>
                    </div>
                    <p className="text-xl font-black text-amber-900">{schedule.time_on}</p>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-200 text-slate-600 rounded-xl">
                        <ZapOff size={18} />
                      </div>
                      <p className="text-sm font-semibold text-slate-700">Giờ tắt</p>
                    </div>
                    <p className="text-xl font-black text-slate-700">{schedule.time_off}</p>
                  </div>

                  {!isDaily && (
                    <div className="flex items-center gap-3 px-2 pt-2">
                      <Calendar size={16} className="text-indigo-400" />
                      <p className="text-sm font-bold text-slate-600">
                        Ngày hẹn: {schedule.trigger_date}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end border-t border-slate-100 pt-4 mt-auto">
                  <button
                    onClick={() => handleDelete(schedule._id || schedule.id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={16} />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Thêm Lịch */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-800">Thêm lịch mới</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Thiết bị</label>
                <select
                  value={formData.device_id}
                  onChange={(e) => setFormData({ ...formData, device_id: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700"
                  required
                >
                  {devices.map(d => (
                    <option key={d._id || d.id} value={d._id || d.id}>
                      {d.name} ({d.room || 'Không rõ phòng'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Lặp lại</label>
                <select
                  value={formData.schedule_type}
                  onChange={(e) => setFormData({ ...formData, schedule_type: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700"
                >
                  <option value="daily">Hàng ngày</option>
                  <option value="once">Một lần</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 text-amber-600">Giờ bật</label>
                  <input
                    type="time"
                    value={formData.time_on}
                    onChange={(e) => setFormData({ ...formData, time_on: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-amber-50 border-none focus:ring-2 focus:ring-amber-500 transition-all font-bold text-amber-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 text-slate-600">Giờ tắt</label>
                  <input
                    type="time"
                    value={formData.time_off}
                    onChange={(e) => setFormData({ ...formData, time_off: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-slate-500 transition-all font-bold text-slate-700"
                    required
                  />
                </div>
              </div>

              {formData.schedule_type === 'once' && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Ngày thực hiện</label>
                  <input
                    type="date"
                    value={formData.trigger_date}
                    onChange={(e) => setFormData({ ...formData, trigger_date: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-700"
                    required={formData.schedule_type === 'once'}
                  />
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Đang lưu...' : 'Lưu lịch hẹn'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
