import { useEffect, useState } from "react";
import { usePage } from "../contexts/PageContext";
import axios from "axios";
import { Activity, Cpu, AlertTriangle, FileText } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Dashboard() {
  const { setTitle } = usePage();
  const [stats, setStats] = useState({ devices: 0, activeDevices: 0, logs: 0, alerts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTitle("Dashboard");
    fetchStats();
  }, [setTitle]);

  const fetchStats = async () => {
    try {
      const [devicesRes, logsRes] = await Promise.all([
        axios.get(`${API_URL}/api/v1/devices`),
        axios.get(`${API_URL}/api/v1/system-logs`)
      ]);

      const devices = devicesRes.data.data || devicesRes.data;
      const logs = logsRes.data.data || logsRes.data;

      setStats({
        devices: devices.length,
        activeDevices: devices.filter(d => d.current_status === 'ON').length,
        logs: logs.length,
        alerts: logs.filter(l => l.event_type.includes('CẢNH BÁO')).length
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Đang tải dữ liệu...</div>;
  }

  const statCards = [
    { title: "Tổng thiết bị", value: stats.devices, icon: Cpu, color: "text-blue-500", bg: "bg-blue-100" },
    { title: "Đang hoạt động", value: stats.activeDevices, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-100" },
    { title: "Cảnh báo", value: stats.alerts, icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-100" },
    { title: "Tổng sự kiện", value: stats.logs, icon: FileText, color: "text-indigo-500", bg: "bg-indigo-100" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
        <div className="w-20 h-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
          <Activity size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Hệ thống đang hoạt động bình thường</h3>
        <p className="text-slate-500">Bạn có thể quản lý thiết bị, cấu hình cảnh báo và xem nhật ký tại các menu tương ứng.</p>
      </div>
    </div>
  );
}
