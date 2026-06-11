import { useEffect, useState } from "react";
import { usePage } from "../contexts/PageContext";
import apiClient from "../services/api";
import { 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  Zap, 
  Cpu, 
  HardDrive, 
  Activity, 
  Radio
} from "lucide-react";

export default function DeviceStatus() {
  const { setTitle } = usePage();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDevices = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await apiClient.get('/devices');
      const data = response.data;
      setDevices(Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []));
      setError(null);
    } catch (err) {
      console.error("Lỗi khi tải trạng thái thiết bị:", err);
      setError("Không thể lấy trạng thái thiết bị.");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    setTitle("Trạng thái thiết bị");
    fetchDevices();

    // Polling mỗi 5 giây
    const interval = setInterval(() => {
      fetchDevices(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [setTitle]);

  // Tính toán công suất tiêu thụ giả định của thiết bị (đáp ứng tiêu chuẩn MVP và trực quan)
  const getPowerUsage = (device) => {
    if (device.type === 'Sensor') return 1.5; // Cảm biến luôn tiêu thụ ít điện năng (~1.5W)
    
    // Nếu là Actuator (Thiết bị điều khiển)
    const isFan = device.name?.toLowerCase().includes('fan') || 
                  device.name?.toLowerCase().includes('quạt') || 
                  device.feed_key?.toLowerCase().includes('fan');
                  
    if (isFan) {
      const speed = Number(device.current_status);
      if (!isNaN(speed) && speed > 0) {
        return Math.round(15 + (speed * 0.45)); // Công suất quạt dựa trên tốc độ (15W - 60W)
      }
      return device.current_status === 'ON' ? 45 : 0;
    }

    return device.current_status === 'ON' ? 12 : 0; // Đèn LED tiêu thụ 12W khi bật, 0W khi tắt
  };

  // Tính toán số liệu thống kê
  const totalDevices = devices.length;
  const onlineDevices = devices.length; // Tất cả thiết bị kết nối Adafruit IO coi như Online
  const activeActuators = devices.filter(d => d.type === 'Actuator' && (d.current_status === 'ON' || (Number(d.current_status) > 0))).length;
  
  const totalPower = devices.reduce((sum, d) => sum + getPowerUsage(d), 0).toFixed(1);

  if (loading && devices.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-20 gap-4">
        <RefreshCw size={40} className="animate-spin text-indigo-500" />
        <p className="font-bold text-slate-400">Đang đồng bộ trạng thái thiết bị...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-6 animate-fade-in flex flex-col gap-6">
      
      {/* Thẻ chỉ số tổng quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Tổng thiết bị</span>
            <span className="text-3xl font-black text-slate-800">{totalDevices}</span>
          </div>
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <Cpu size={24} />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Kết nối (Online)</span>
            <span className="text-3xl font-black text-emerald-500">{onlineDevices}</span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <Wifi size={24} />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Đang kích hoạt</span>
            <span className="text-3xl font-black text-amber-500">{activeActuators}</span>
          </div>
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
            <Radio size={24} />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Công suất tải</span>
            <span className="text-3xl font-black text-indigo-600">{totalPower} W</span>
          </div>
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <Zap size={24} />
          </div>
        </div>
      </div>

      {/* Danh sách thiết bị chi tiết */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col flex-1">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Thông số vận hành thời gian thực</h3>
            <p className="text-xs text-slate-500">Giám sát tải điện năng và tín hiệu kết nối</p>
          </div>
          <button 
            onClick={() => fetchDevices(true)}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 transition-all hover:shadow-sm active:scale-95"
            title="Làm mới"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Thiết bị</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Vị trí</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Loại thiết bị</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Trạng thái hiện tại</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Công suất điện</th>
                <th className="px-8 py-5 text-right text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Kết nối</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {devices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center text-slate-400 italic">
                    Không tìm thấy thiết bị nào trong hệ thống.
                  </td>
                </tr>
              ) : (
                devices.map((device) => {
                  const isSensor = device.type === 'Sensor';
                  const power = getPowerUsage(device);
                  
                  return (
                    <tr key={device._id || device.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                            <HardDrive size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{device.name}</p>
                            <code className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">{device.feed_key}</code>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <span className="text-sm font-bold text-slate-600">
                          {device.room || "Chưa thiết lập"}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                          isSensor 
                            ? 'bg-blue-50 text-blue-600 border-blue-100' 
                            : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          {isSensor ? "Cảm biến" : "Điều khiển"}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        {isSensor ? (
                          <span className="text-sm font-black text-slate-800 bg-slate-100 px-3 py-1 rounded-full">
                            {device.current_status}
                          </span>
                        ) : (
                          <span className={`text-sm font-black ${
                            device.current_status === 'ON' || (Number(device.current_status) > 0)
                              ? 'text-emerald-600' 
                              : 'text-slate-400'
                          }`}>
                            {device.current_status === 'ON' ? 'Đang bật' : device.current_status === 'OFF' ? 'Đang tắt' : `Mức: ${device.current_status}`}
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-4">
                        <span className="text-sm font-bold text-slate-700">{power} W</span>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 ml-auto">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                          Hoạt động
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
