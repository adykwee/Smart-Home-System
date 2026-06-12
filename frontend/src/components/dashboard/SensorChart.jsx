import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import apiClient from "../../services/api";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from "recharts";
import { BarChart2, RefreshCw } from "lucide-react";

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || "http://localhost:5000";

export default function SensorChart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm lấy dữ liệu lịch sử từ Database
  const fetchData = async () => {
    try {
      const res = await apiClient.get('/sensor-data');
      const raw = res.data?.data || [];
      
      // Gộp các dữ liệu có thời gian gần nhau để vẽ biểu đồ liền mạch
      const groupedData = {};
      raw.forEach(item => {
        const time = new Date(item.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        if (!groupedData[time]) {
          groupedData[time] = { time, temperature: null, humidity: null, light: null };
        }
        if (item.temperature !== undefined) groupedData[time].temperature = item.temperature;
        if (item.humidity !== undefined) groupedData[time].humidity = item.humidity;
        if (item.light !== undefined) groupedData[time].light = item.light;
      });

      // Chuyển thành mảng và sắp xếp từ cũ đến mới
      const formatted = Object.values(groupedData).reverse();
      setChartData(formatted);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu biểu đồ:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Lắng nghe dữ liệu Real-time từ Socket.io
    const socket = io(SOCKET_URL);
    socket.on("realtime_data", () => {
      // Khi có dữ liệu mới, tải lại biểu đồ ngay lập tức để tạo hiệu ứng Real-time
      fetchData();
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <BarChart2 size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Environment Monitoring</h3>
            <p className="text-xs text-slate-400">Real-time data from sensors</p>
          </div>
        </div>
        <button onClick={fetchData} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Nhiệt độ */}
        <div className="h-[220px] w-full bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50">
          <h4 className="text-xs font-bold text-slate-500 mb-2">Nhiệt độ (°C)</h4>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" tick={{fontSize: 9}} tickLine={false} axisLine={false} />
                <YAxis tick={{fontSize: 9}} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="temperature" stroke="#ef4444" fillOpacity={1} fill="url(#colorTemp)" strokeWidth={2} connectNulls />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 italic text-xs">Đang đợi dữ liệu...</div>
          )}
        </div>

        {/* Chart Độ ẩm */}
        <div className="h-[220px] w-full bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50">
          <h4 className="text-xs font-bold text-slate-500 mb-2">Độ ẩm (%)</h4>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHumid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" tick={{fontSize: 9}} tickLine={false} axisLine={false} />
                <YAxis tick={{fontSize: 9}} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="humidity" stroke="#3b82f6" fillOpacity={1} fill="url(#colorHumid)" strokeWidth={2} connectNulls />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 italic text-xs">Đang đợi dữ liệu...</div>
          )}
        </div>

        {/* Chart Ánh sáng */}
        <div className="h-[220px] w-full bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50">
          <h4 className="text-xs font-bold text-slate-500 mb-2">Ánh sáng (Lux)</h4>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" tick={{fontSize: 9}} tickLine={false} axisLine={false} />
                <YAxis tick={{fontSize: 9}} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="light" stroke="#eab308" fillOpacity={1} fill="url(#colorLight)" strokeWidth={2} connectNulls />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 italic text-xs">Đang đợi dữ liệu...</div>
          )}
        </div>
      </div>
    </div>
  );
}
