import { useEffect, useState } from "react";
import { usePage } from "../contexts/PageContext";
import apiClient from "../services/api";
import { Clock, HardDrive, AlertCircle, Info, RefreshCw, ChevronRight } from "lucide-react";

export default function Logs() {
  const { setTitle } = usePage();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTitle("Nhật Ký Hệ Thống");
    fetchLogs();
  }, [setTitle]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/system-logs");
      setLogs(res.data.data || []);
    } catch (error) {
      console.error("Lỗi tải log:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full p-6 animate-fade-in flex flex-col gap-6">
      
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <HardDrive size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Lịch sử sự kiện</h2>
            <p className="text-sm text-slate-500">Xem lại các cảnh báo và hoạt động của hệ thống</p>
          </div>
        </div>
        <button 
          onClick={fetchLogs} 
          disabled={loading}
          className="bg-white border border-slate-200 hover:border-indigo-300 text-slate-600 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 hover:shadow-md active:scale-95"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Làm mới dữ liệu
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col flex-1">
        {loading && logs.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20 gap-4">
            <RefreshCw size={40} className="animate-spin text-indigo-500" />
            <p className="font-bold text-slate-400">Đang truy xuất dữ liệu...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Thời gian</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Thiết bị</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Trạng thái</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Nội dung chi tiết</th>
                  <th className="px-6 py-5 border-b border-slate-100"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Info size={40} strokeWidth={1} />
                        <p className="font-medium italic">Hiện tại chưa có sự kiện nào được ghi lại.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log._id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                            <Clock size={14} />
                          </div>
                          <span className="text-sm font-bold text-slate-600">
                            {new Date(log.created_at).toLocaleString("vi-VN", {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full">
                          {log.device_id?.name || "Hệ thống"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                          log.event_type === 'ALERT' 
                            ? 'bg-rose-50 text-rose-600 border-rose-100' 
                            : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                        }`}>
                          <AlertCircle size={12} />
                          {log.event_type === 'ALERT' ? 'Cảnh báo' : 'Thông tin'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className={`text-sm leading-relaxed ${
                          log.event_type === 'ALERT' ? 'text-rose-700 font-medium' : 'text-slate-600'
                        }`}>
                          {log.description}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ChevronRight size={18} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Footer Info */}
      <div className="text-center text-xs text-slate-400 font-medium">
        Tự động cập nhật mỗi khi có sự kiện mới được ghi nhận trong hệ thống.
      </div>
    </div>
  );
}
