import { useEffect, useState } from "react";
import { usePage } from "../contexts/PageContext";
import axios from "axios";
import { FileText, AlertTriangle, Activity, User } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Logs() {
  const { setTitle } = usePage();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTitle("Nhật ký");
    fetchLogs();
  }, [setTitle]);

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/system-logs`);
      setLogs(res.data.data || res.data);
    } catch (error) {
      console.error("Lỗi khi tải nhật ký:", error);
    } finally {
      setLoading(false);
    }
  };

  const getEventStyle = (type) => {
    if (type?.includes("CẢNH BÁO")) return { icon: <AlertTriangle size={16} />, cls: "bg-rose-100 text-rose-700" };
    if (type?.includes("ĐIỀU KHIỂN")) return { icon: <Activity size={16} />, cls: "bg-indigo-100 text-indigo-700" };
    return { icon: <FileText size={16} />, cls: "bg-slate-100 text-slate-600" };
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Lịch sử hoạt động</h2>
            <p className="text-sm text-slate-500">Xem lại các sự kiện đã xảy ra trong hệ thống</p>
          </div>
          <button onClick={fetchLogs} className="px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
            Làm mới
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">Đang tải dữ liệu...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Thời gian</th>
                  <th className="px-6 py-4 font-semibold">Loại sự kiện</th>
                  <th className="px-6 py-4 font-semibold">Mô tả chi tiết</th>
                  <th className="px-6 py-4 font-semibold">Người thực hiện</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {logs.map((log) => {
                  const style = getEventStyle(log.event_type);
                  return (
                    <tr key={log._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                        {new Date(log.created_at || log.createdAt).toLocaleString("vi-VN")}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${style.cls}`}>
                          {style.icon}
                          {log.event_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm">{log.description}</td>
                      <td className="px-6 py-4">
                        {log.user_id ? (
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
                              <User size={14} className="text-indigo-600" />
                            </div>
                            <span className="text-sm font-medium text-slate-700">
                              {typeof log.user_id === 'object' ? log.user_id.username : log.user_id}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400 italic">Hệ thống</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                      Chưa có nhật ký nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
