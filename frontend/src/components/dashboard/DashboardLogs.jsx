import { useEffect, useState } from "react";
import apiClient from "../../services/api";
import { AlertCircle, Info, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await apiClient.get('/system-logs');
        const data = res.data?.data || res.data || [];
        setLogs(Array.isArray(data) ? data.slice(0, 5) : []);
      } catch (error) {
        console.error("Lỗi lấy logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col flex-1 border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800">Activity logs</h3>
        <button onClick={() => navigate('/logs')} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
          View All
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm font-medium">Đang tải...</div>
        ) : logs.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm font-medium italic">Không có ghi nhận nào.</div>
        ) : (
          logs.map(log => (
            <div key={log._id} className="flex gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate('/logs')}>
              <div className={`mt-0.5 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                log.event_type === 'ALERT' ? 'bg-rose-50 text-rose-500' : 'bg-indigo-50 text-indigo-500'
              }`}>
                {log.event_type === 'ALERT' ? <AlertCircle size={16} /> : <Info size={16} />}
              </div>
              <div className="flex-1 overflow-hidden flex flex-col justify-center">
                <p className="text-sm font-semibold text-slate-700 line-clamp-2 leading-snug">{log.description}</p>
                <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-400 font-bold tracking-wider uppercase">
                  <Clock size={10} />
                  <span>
                    {new Date(log.created_at).toLocaleString("vi-VN", {
                      hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
