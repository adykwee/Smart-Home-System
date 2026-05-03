import { useEffect, useState, useCallback } from "react";
import { usePage } from "../contexts/PageContext";
import { Thermometer, Droplets, Activity, Sun, Bell } from "lucide-react";
import io from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Toast component nhỏ gọn
function AlertToast({ alerts, onDismiss }) {
  if (alerts.length === 0) return null;
  return (
    <div className="fixed top-6 right-6 z-50 space-y-3 max-w-sm">
      {alerts.map((a) => (
        <div
          key={a.id}
          className="flex items-start gap-3 p-4 bg-rose-600 text-white rounded-2xl shadow-2xl shadow-rose-600/30 animate-in slide-in-from-right-5 duration-300"
        >
          <Bell size={20} className="shrink-0 mt-0.5 animate-bounce" />
          <div className="flex-1">
            <p className="font-bold text-sm">Cảnh báo ngưỡng!</p>
            <p className="text-xs text-rose-100 mt-0.5">{a.message}</p>
          </div>
          <button onClick={() => onDismiss(a.id)} className="text-rose-200 hover:text-white text-lg leading-none">×</button>
        </div>
      ))}
    </div>
  );
}

export default function DeviceStatus() {
  const { setTitle } = usePage();
  const [sensorData, setSensorData] = useState({});
  const [alerts, setAlerts] = useState([]);

  const dismissAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }, []);

  useEffect(() => {
    setTitle("Trạng thái");

    const socket = io(API_URL);

    socket.on("connect", () => {
      console.log("Connected to Real-time server");
    });

    socket.on("realtime_data", (data) => {
      setSensorData(prev => ({
        ...prev,
        [data.feed]: data.value
      }));
    });

    // Lắng nghe cảnh báo vượt ngưỡng (Observer Pattern)
    socket.on("alert", (data) => {
      const newAlert = { id: Date.now(), message: data.message, feed: data.feed };
      setAlerts(prev => [newAlert, ...prev].slice(0, 5)); // Giữ tối đa 5 toast

      // Tự xóa sau 6 giây
      setTimeout(() => dismissAlert(newAlert.id), 6000);
    });

    return () => {
      socket.disconnect();
    };
  }, [setTitle, dismissAlert]);

  // Tìm giá trị cho từng loại cảm biến
  const getVal = (keywords) => {
    const key = Object.keys(sensorData).find(k => keywords.some(kw => k.toLowerCase().includes(kw)));
    return key ? sensorData[key] : null;
  };

  const tempVal = getVal(['temp']);
  const humidVal = getVal(['humid']);
  const lightVal = getVal(['light', 'lux']);

  const sensors = [
    {
      label: "Nhiệt độ", unit: "°C", value: tempVal,
      icon: <Thermometer size={24} />,
      bg: "bg-rose-50 border-rose-100", iconBg: "bg-rose-500", iconShadow: "shadow-rose-500/30",
      text: "text-rose-600", pulse: "text-rose-200"
    },
    {
      label: "Độ ẩm", unit: "%", value: humidVal,
      icon: <Droplets size={24} />,
      bg: "bg-blue-50 border-blue-100", iconBg: "bg-blue-500", iconShadow: "shadow-blue-500/30",
      text: "text-blue-600", pulse: "text-blue-200"
    },
    {
      label: "Ánh sáng", unit: "lux", value: lightVal,
      icon: <Sun size={24} />,
      bg: "bg-amber-50 border-amber-100", iconBg: "bg-amber-500", iconShadow: "shadow-amber-500/30",
      text: "text-amber-600", pulse: "text-amber-200"
    },
  ];

  return (
    <>
      <AlertToast alerts={alerts} onDismiss={dismissAlert} />

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Dữ liệu Cảm biến Real-time</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sensors.map((s) => (
              <div key={s.label} className={`p-6 ${s.bg} border rounded-2xl flex items-center justify-between`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${s.iconBg} rounded-full flex items-center justify-center text-white shadow-lg ${s.iconShadow}`}>
                    {s.icon}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${s.text}`}>{s.label}</p>
                    <p className="text-3xl font-bold text-slate-800">
                      {s.value !== null ? s.value : '--'}
                      <span className="text-lg text-slate-500"> {s.unit}</span>
                    </p>
                  </div>
                </div>
                <Activity className={`${s.pulse} animate-pulse`} size={48} />
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-500 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            Dữ liệu đang được cập nhật liên tục từ thiết bị qua MQTT và Socket.IO
          </div>
        </div>
      </div>
    </>
  );
}
