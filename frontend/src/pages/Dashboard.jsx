import { useEffect, useState } from "react";
import { usePage } from "../contexts/PageContext";
import apiClient from "../services/api";
import { io } from "socket.io-client";
import { Thermometer, Droplets, Sun, Activity, Power } from "lucide-react";

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || "http://localhost:5000";

export default function Dashboard() {
  const { setTitle } = usePage();
  const [dbDevices, setDbDevices] = useState([]);
  const [sensorValues, setSensorValues] = useState({});
  const [devicesState, setDevicesState] = useState({});
  
  useEffect(() => {
    setTitle("Bảng điều khiển");
    
    // Fetch initial devices
    const fetchDevices = async () => {
      try {
        const res = await apiClient.get('/devices');
        const list = res.data?.data || res.data || [];
        setDbDevices(list);

        // Map initial states
        const initialSensors = {};
        const initialActuators = {};
        list.forEach(d => {
          if (d.type === 'Sensor' || d.feed_key?.includes('sensor')) {
            initialSensors[d.feed_key] = d.current_status;
          } else {
            initialActuators[d._id] = d.current_status === 'ON';
          }
        });
        setSensorValues(initialSensors);
        setDevicesState(initialActuators);
      } catch (err) {
        console.error("Lỗi khi tải danh sách thiết bị:", err);
      }
    };

    fetchDevices();

    // Establish WebSocket connection
    const socket = io(SOCKET_URL);
    socket.on("realtime_data", (data) => {
      setSensorValues(prev => ({
        ...prev,
        [data.feed]: data.value
      }));
      setDbDevices(prev => 
        prev.map(d => d.feed_key === data.feed ? { ...d, current_status: data.value } : d)
      );
    });

    return () => socket.disconnect();
  }, [setTitle]);

  const toggleDevice = async (id, feedKey, currentStatus) => {
    const nextStatus = !currentStatus;
    try {
      await apiClient.post('/devices/control', {
        id,
        feedKey,
        trangThai: nextStatus ? 'ON' : 'OFF'
      });
      setDevicesState(prev => ({
        ...prev,
        [id]: nextStatus
      }));
      setDbDevices(prev =>
        prev.map(d => d._id === id ? { ...d, current_status: nextStatus ? 'ON' : 'OFF' } : d)
      );
    } catch (err) {
      console.error("Lỗi khi điều khiển thiết bị:", err);
    }
  };

  const getSensorIcon = (feedKey) => {
    const key = feedKey.toLowerCase();
    if (key.includes("temp") || key.includes("nhiet")) return <Thermometer className="text-orange-500" />;
    if (key.includes("humid") || key.includes("doam")) return <Droplets className="text-blue-500" />;
    if (key.includes("light") || key.includes("anhsang")) return <Sun className="text-yellow-500" />;
    return <Activity className="text-rose-500" />;
  };

  const sensors = dbDevices.filter(d => d.type === 'Sensor');
  const actuators = dbDevices.filter(d => d.type === 'Actuator');

  return (
    <div className="w-full py-6 space-y-8">
      {/* Sensors List */}
      <div>
        <h2 className="text-lg font-semibold text-slate-700 mb-4">Thông số cảm biến</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sensors.map(sensor => {
            const val = sensorValues[sensor.feed_key] ?? sensor.current_status;
            let unit = "";
            let name = sensor.name;
            const key = sensor.feed_key.toLowerCase();
            if (key.includes("temp")) { unit = "°C"; name = "Nhiệt độ"; }
            else if (key.includes("humid")) { unit = "%"; name = "Độ ẩm"; }
            else if (key.includes("light")) { unit = "Lux"; name = "Ánh sáng"; }
            
            return (
              <div key={sensor._id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100">
                  {getSensorIcon(sensor.feed_key)}
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">{name} ({sensor.room || 'Mặc định'})</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">
                    {val !== undefined && val !== null ? val : '--'}
                    <span className="text-sm font-normal text-slate-500 ml-1">{unit}</span>
                  </p>
                </div>
              </div>
            );
          })}
          {sensors.length === 0 && (
            <p className="text-slate-400 text-sm italic col-span-full">Không tìm thấy cảm biến nào.</p>
          )}
        </div>
      </div>

      {/* Actuators List */}
      <div>
        <h2 className="text-lg font-semibold text-slate-700 mb-4">Điều khiển thiết bị</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {actuators.map(device => {
            const isOn = devicesState[device._id] ?? (device.current_status === 'ON');
            return (
              <div key={device._id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between min-h-[140px]">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800">{device.name}</h3>
                    <p className="text-xs text-slate-500">{device.room || 'Mặc định'}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${isOn ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-slate-50 text-slate-600 border border-slate-200'}`}>
                    {isOn ? 'Đang bật' : 'Đang tắt'}
                  </span>
                </div>
                
                <button
                  onClick={() => toggleDevice(device._id, device.feed_key, isOn)}
                  className={`w-full py-2.5 mt-4 rounded-lg font-bold flex items-center justify-center gap-2 border transition-all ${
                    isOn 
                      ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100/60' 
                      : 'bg-slate-900 border-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  <Power size={16} />
                  <span>{isOn ? 'Tắt thiết bị' : 'Bật thiết bị'}</span>
                </button>
              </div>
            );
          })}
          {actuators.length === 0 && (
            <p className="text-slate-400 text-sm italic col-span-full">Không tìm thấy thiết bị điều khiển nào.</p>
          )}
        </div>
      </div>
    </div>
  );
}
