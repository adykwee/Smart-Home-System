import { useEffect, useState } from "react";
import { usePage } from "../contexts/PageContext";
import axios from "axios";
import { AlertTriangle, Plus, Trash2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Thresholds() {
  const { setTitle } = usePage();
  const [thresholds, setThresholds] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [deviceId, setDeviceId] = useState("");
  const [metricType, setMetricType] = useState("temperature");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");

  useEffect(() => {
    setTitle("Ngưỡng");
    fetchData();
  }, [setTitle]);

  useEffect(() => {
    const device = devices.find(d => d._id === deviceId);
    if (device) {
      const name = device.name?.toLowerCase() || '';
      const feed = device.feed_key?.toLowerCase() || '';
      if (name.includes('nhiệt') || feed.includes('temp')) setMetricType('temperature');
      else if (name.includes('ẩm') || feed.includes('humid')) setMetricType('humidity');
      else if (name.includes('sáng') || feed.includes('light') || feed.includes('lux')) setMetricType('light');
    }
  }, [deviceId, devices]);

  const fetchData = async () => {
    try {
      const [threshRes, devRes] = await Promise.all([
        axios.get(`${API_URL}/api/v1/thresholds`),
        axios.get(`${API_URL}/api/v1/devices`)
      ]);
      setThresholds(threshRes.data.data || threshRes.data);
      setDevices(devRes.data.data || devRes.data);
      if (devRes.data.data?.length > 0) {
        setDeviceId(devRes.data.data[0]._id);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddThreshold = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/v1/thresholds`, {
        device_id: deviceId,
        metric_type: metricType,
        min_value: minValue ? Number(minValue) : null,
        max_value: maxValue ? Number(maxValue) : null,
      });
      fetchData(); // Reload
      setMinValue("");
      setMaxValue("");
    } catch (error) {
      alert("Lỗi khi thêm ngưỡng");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa cấu hình ngưỡng này?")) return;
    try {
      await axios.delete(`${API_URL}/api/v1/thresholds/${id}`);
      setThresholds(thresholds.filter(t => t._id !== id));
    } catch (error) {
      alert("Lỗi khi xóa");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Form thêm ngưỡng mới */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Plus size={20} className="text-indigo-500" />
            Thêm ngưỡng mới
          </h2>
          <form onSubmit={handleAddThreshold} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Thiết bị</label>
              <select
                value={deviceId}
                onChange={e => setDeviceId(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              >
                {devices.filter(d => d.type === 'Sensor').map(d => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Loại Metric</label>
              <select
                value={metricType}
                onChange={e => setMetricType(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="temperature">Nhiệt độ (°C)</option>
                <option value="humidity">Độ ẩm (%)</option>
                <option value="light">Ánh sáng (lux)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ngưỡng Min</label>
                <input
                  type="number"
                  value={minValue}
                  onChange={e => setMinValue(e.target.value)}
                  placeholder="Ví dụ: 20"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ngưỡng Max</label>
                <input
                  type="number"
                  value={maxValue}
                  onChange={e => setMaxValue(e.target.value)}
                  placeholder="Ví dụ: 35"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors">
              Lưu Cấu Hình
            </button>
          </form>
        </div>

        {/* Danh sách ngưỡng hiện tại */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-800">Danh sách Cấu hình Cảnh báo</h2>
            <p className="text-sm text-slate-500">Khi giá trị vượt ngưỡng, hệ thống sẽ ghi Log và báo động.</p>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500">Đang tải dữ liệu...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Thiết bị</th>
                    <th className="px-6 py-4 font-semibold">Metric</th>
                    <th className="px-6 py-4 font-semibold">Ngưỡng (Min - Max)</th>
                    <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {thresholds.map((t) => (
                    <tr key={t._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-700">
                        {t.device_id?.name || t.device_id || 'Unknown Device'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md">
                          {t.metric_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-mono text-sm">
                        {t.min_value ?? 'N/A'} {' <---> '} {t.max_value ?? 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(t._id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {thresholds.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                        Chưa có cấu hình ngưỡng nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
