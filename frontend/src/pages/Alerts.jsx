import { useEffect, useState } from "react";
import { usePage } from "../contexts/PageContext";
import apiClient from "../services/api";
import { AlertTriangle, Plus, Trash2, Edit2, Check, X, Thermometer, Droplets, Zap, Activity } from "lucide-react";

export default function Alerts() {
  const { setTitle } = usePage();
  const [thresholds, setThresholds] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({
    device_id: "",
    metric_type: "temperature",
    min_value: "",
    max_value: ""
  });

  // Tự động nhận diện loại thông số dựa trên thiết bị được chọn
  useEffect(() => {
    if (formData.device_id && !editId) { // Chỉ tự động chọn khi thêm mới, không đè khi đang sửa
      const selectedDev = devices.find(d => d._id === formData.device_id);
      if (selectedDev) {
        const name = (selectedDev.name || "").toLowerCase();
        const feed = (selectedDev.feed_key || "").toLowerCase();
        
        if (name.includes("temp") || name.includes("nhiet") || feed.includes("temp") || feed.includes("nhiet")) {
          setFormData(prev => ({ ...prev, metric_type: "temperature" }));
        } else if (name.includes("humid") || name.includes("doam") || feed.includes("humid") || feed.includes("doam")) {
          setFormData(prev => ({ ...prev, metric_type: "humidity" }));
        } else if (name.includes("light") || name.includes("anhsang") || feed.includes("light") || feed.includes("anhsang")) {
          setFormData(prev => ({ ...prev, metric_type: "light" }));
        }
      }
    }
  }, [formData.device_id, devices, editId]);

  useEffect(() => {
    setTitle("Thiết Lập Ngưỡng Cảnh Báo");
    fetchData();
  }, [setTitle]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tRes, dRes] = await Promise.all([
        apiClient.get("/thresholds"),
        apiClient.get("/devices")
      ]);
      const tData = tRes.data;
      const dData = dRes.data;
      setThresholds(Array.isArray(tData?.data) ? tData.data : (Array.isArray(tData) ? tData : []));
      // Filter only sensors for thresholds
      const deviceList = Array.isArray(dData?.data) ? dData.data : (Array.isArray(dData) ? dData : []);
      setDevices(deviceList.filter(d => d.type === "Sensor"));
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editId) {
        await apiClient.put(`/thresholds/${editId}`, formData);
      } else {
        await apiClient.post("/thresholds", formData);
      }
      setIsAdding(false);
      setEditId(null);
      setFormData({ device_id: "", metric_type: "temperature", min_value: "", max_value: "" });
      fetchData();
    } catch (error) {
      alert("Lỗi khi lưu ngưỡng: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa ngưỡng này?")) {
      try {
        await apiClient.delete(`/thresholds/${id}`);
        fetchData();
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
      }
    }
  };

  const startEdit = (t) => {
    setEditId(t._id);
    setFormData({
      device_id: t.device_id?._id || t.device_id,
      metric_type: t.metric_type,
      min_value: t.min_value || "",
      max_value: t.max_value || ""
    });
    setIsAdding(true);
  };

  const getIcon = (type) => {
    if (!type) return <Zap className="text-slate-400" />;
    if (type.toLowerCase().includes("temp")) return <Thermometer className="text-orange-400" />;
    if (type.toLowerCase().includes("humid")) return <Droplets className="text-blue-400" />;
    if (type.toLowerCase().includes("motion")) return <Activity className="text-red-400" />;
    return <Zap className="text-yellow-400" />;
  };

  return (
    <div className="w-full h-full p-6 animate-fade-in flex flex-col gap-6">
      
      {/* Header & Add Button */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Cấu hình ngưỡng</h2>
          <p className="text-sm text-slate-500">Thiết lập các giới hạn để nhận thông báo cảnh báo</p>
        </div>
        <button 
          onClick={() => { setIsAdding(!isAdding); setEditId(null); }}
          className="bg-[#7048e8] text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 hover:bg-[#6038d8] transition-all shadow-lg shadow-[#7048e8]/20"
        >
          {isAdding ? <X size={18} /> : <Plus size={18} />}
          {isAdding ? "Hủy bỏ" : "Thêm ngưỡng mới"}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 items-start">
        
        {/* Form Section */}
        {isAdding && (
          <div className="xl:col-span-1 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-slide-in-left">
            <h3 className="text-lg font-bold text-slate-800 mb-6">{editId ? "Cập nhật ngưỡng" : "Tạo ngưỡng mới"}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Thiết bị cảm biến</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 outline-none focus:border-[#7048e8]"
                  value={formData.device_id}
                  onChange={(e) => setFormData({...formData, device_id: e.target.value})}
                >
                  <option value="">Chọn thiết bị...</option>
                  {devices.map(d => (
                    <option key={d._id} value={d._id}>{d.name} ({d.room})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Loại thông số</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 outline-none focus:border-[#7048e8]"
                  value={formData.metric_type}
                  onChange={(e) => setFormData({...formData, metric_type: e.target.value})}
                >
                  <option value="temperature">Nhiệt độ (°C)</option>
                  <option value="humidity">Độ ẩm (%)</option>
                  <option value="light">Ánh sáng (Lux)</option>
                  <option value="motion">Chuyển động (1 / 0)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Ngưỡng dưới (Min)</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 outline-none focus:border-[#7048e8]"
                    placeholder="VD: 15"
                    value={formData.min_value}
                    onChange={(e) => setFormData({...formData, min_value: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Ngưỡng trên (Max)</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 outline-none focus:border-[#7048e8]"
                    placeholder="VD: 35"
                    value={formData.max_value}
                    onChange={(e) => setFormData({...formData, max_value: e.target.value})}
                  />
                </div>
              </div>

              <button 
                onClick={handleSave}
                disabled={!formData.device_id}
                className="w-full bg-[#7048e8] text-white font-bold py-4 rounded-2xl mt-4 hover:bg-[#6038d8] transition-all disabled:bg-slate-300 shadow-lg shadow-[#7048e8]/20"
              >
                Lưu cài đặt
              </button>
            </div>
          </div>
        )}

        {/* List Section */}
        <div className={`${isAdding ? 'xl:col-span-2' : 'xl:col-span-3'} grid grid-cols-1 md:grid-cols-2 gap-4`}>
          {loading ? (
            <div className="col-span-full py-20 text-center text-slate-400">Đang tải dữ liệu...</div>
          ) : thresholds.length === 0 ? (
            <div className="col-span-full bg-white p-12 rounded-3xl border-2 border-dashed border-slate-200 text-center text-slate-500 italic">
              Chưa có ngưỡng cảnh báo nào được thiết lập.
            </div>
          ) : (
            thresholds.map(t => (
              <div key={t._id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-[#7048e8]/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center">
                    {getIcon(t.metric_type)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 capitalize">{t.metric_type}</h4>
                    <p className="text-xs text-slate-500">{t.device_id?.name || "Thiết bị không xác định"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Phạm vi an toàn</p>
                    <p className="font-bold text-slate-700">
                      {t.min_value ?? "-"} → {t.max_value ?? "-"}
                      <span className="text-xs font-normal text-slate-400 ml-1">
                        {t.metric_type === 'temperature' ? '°C' : t.metric_type === 'humidity' ? '%' : t.metric_type === 'light' ? 'Lux' : ''}
                      </span>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => startEdit(t)}
                      className="p-2 text-slate-400 hover:text-[#7048e8] hover:bg-[#7048e8]/10 rounded-xl transition-all"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(t._id)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
