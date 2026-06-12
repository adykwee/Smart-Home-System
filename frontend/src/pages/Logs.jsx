import { useEffect, useState } from "react";
import { usePage } from "../contexts/PageContext";
import apiClient from "../services/api";
import { 
  Clock, 
  HardDrive, 
  AlertCircle, 
  Info, 
  RefreshCw, 
  ChevronRight, 
  User as UserIcon, 
  Search, 
  Download, 
  Calendar, 
  Filter 
} from "lucide-react";

export default function Logs() {
  const { setTitle } = usePage();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [eventType, setEventType] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    setTitle("Nhật Ký Hệ Thống");
    fetchLogs();
  }, [setTitle]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/system-logs");
      const data = res.data;
      setLogs(Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []));
    } catch (error) {
      console.error("Lỗi tải log:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const searchLower = searchTerm.toLowerCase().trim();
    let matchesSearch = true;
    if (searchLower) {
      const descMatch = log.description?.toLowerCase().includes(searchLower);
      const deviceMatch = log.device_id?.name?.toLowerCase().includes(searchLower);
      const userMatch = log.user_id?.username?.toLowerCase().includes(searchLower);
      matchesSearch = descMatch || deviceMatch || userMatch;
    }

    const matchesType = !eventType || eventType === "ALL" || log.event_type === eventType;

    let matchesDate = true;
    if (log.created_at) {
      const logDate = new Date(log.created_at);
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (logDate < start) matchesDate = false;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (logDate > end) matchesDate = false;
      }
    }

    return matchesSearch && matchesType && matchesDate;
  });

  const getEventBadge = (type) => {
    switch (type) {
      case 'ALERT':
        return {
          label: 'Cảnh báo',
          classes: 'bg-rose-50 text-rose-600 border-rose-100'
        };
      case 'MOTION_ALERT':
        return {
          label: 'Chuyển động',
          classes: 'bg-amber-50 text-amber-600 border-amber-100'
        };
      case 'ĐIỀU KHIỂN THIẾT BỊ':
        return {
          label: 'Điều khiển',
          classes: 'bg-amber-50 text-amber-600 border-amber-100'
        };
      case 'DEVICE_MANAGEMENT':
        return {
          label: 'Thiết bị',
          classes: 'bg-blue-50 text-blue-600 border-blue-100'
        };
      case 'SCHEDULE_MANAGEMENT':
        return {
          label: 'Quản lý Lịch',
          classes: 'bg-purple-50 text-purple-600 border-purple-100'
        };
      case 'SCHEDULE_EXECUTION':
        return {
          label: 'Chạy Lịch',
          classes: 'bg-emerald-50 text-emerald-600 border-emerald-100'
        };
      case 'THRESHOLD_CHANGE':
        return {
          label: 'Đổi Ngưỡng',
          classes: 'bg-teal-50 text-teal-600 border-teal-100'
        };
      case 'USER_MANAGEMENT':
        return {
          label: 'Người dùng',
          classes: 'bg-indigo-50 text-indigo-600 border-indigo-100'
        };
      default:
        return {
          label: type || 'Hệ thống',
          classes: 'bg-slate-50 text-slate-600 border-slate-100'
        };
    }
  };

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      alert("Không có dữ liệu để xuất!");
      return;
    }

    const headers = ["Thời gian", "Thiết bị", "Loại sự kiện", "Người thực hiện", "Nội dung chi tiết"];
    
    const rows = filteredLogs.map(log => {
      const timeStr = new Date(log.created_at).toLocaleString("vi-VN", {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const deviceName = log.device_id?.name || "Hệ thống";
      const eventBadge = getEventBadge(log.event_type);
      const eventLabel = eventBadge.label;
      const userName = log.user_id?.username || "Hệ thống";
      const description = log.description || "";

      const cleanTime = timeStr.replace(/"/g, '""');
      const cleanDevice = deviceName.replace(/"/g, '""');
      const cleanEvent = eventLabel.replace(/"/g, '""');
      const cleanUser = userName.replace(/"/g, '""');
      const cleanDesc = description.replace(/"/g, '""');

      return [
        `"${cleanTime}"`,
        `"${cleanDevice}"`,
        `"${cleanEvent}"`,
        `"${cleanUser}"`,
        `"${cleanDesc}"`
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    // Thêm BOM để Excel hiển thị đúng font tiếng Việt
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute("download", `nhat_ky_smart_home_${dateStr}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full p-6 animate-fade-in flex flex-col gap-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <HardDrive size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Lịch sử sự kiện</h2>
            <p className="text-sm text-slate-500">Xem lại các cảnh báo và hoạt động của hệ thống</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button 
            onClick={fetchLogs} 
            disabled={loading}
            className="bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-600 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 hover:shadow-sm active:scale-95 flex-1 md:flex-none justify-center"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Làm mới dữ liệu
          </button>
          <button 
            onClick={handleExportCSV}
            disabled={loading || filteredLogs.length === 0}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/25 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none flex-1 md:flex-none justify-center"
          >
            <Download size={16} />
            Xuất báo cáo (CSV)
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Tìm kiếm</label>
          <div className="relative">
            <input 
              type="text"
              placeholder="Thiết bị, người thực hiện, nội dung..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-400"
            />
            <Search className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Loại sự kiện</label>
          <div className="relative">
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer"
            >
              <option value="ALL">Tất cả sự kiện</option>
              <option value="ALERT">Cảnh báo ngưỡng (Alert)</option>
              <option value="MOTION_ALERT">Cảnh báo chuyển động</option>
              <option value="ĐIỀU KHIỂN THIẾT BỊ">Điều khiển thiết bị</option>
              <option value="DEVICE_MANAGEMENT">Quản lý thiết bị</option>
              <option value="SCHEDULE_MANAGEMENT">Quản lý lịch trình</option>
              <option value="SCHEDULE_EXECUTION">Thực thi lịch trình</option>
              <option value="THRESHOLD_CHANGE">Thay đổi ngưỡng</option>
              <option value="USER_MANAGEMENT">Quản lý người dùng</option>
            </select>
            <Filter className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Từ ngày</label>
          <div className="relative">
            <input 
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition-all cursor-pointer"
            />
            <Calendar className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Đến ngày</label>
          <div className="relative">
            <input 
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition-all cursor-pointer"
            />
            <Calendar className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
          </div>
        </div>
      </div>

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
                  <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 w-64">Thiết bị</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Loại sự kiện</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Người thực hiện</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Nội dung chi tiết</th>
                  <th className="px-6 py-5 border-b border-slate-100"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Info size={40} strokeWidth={1} />
                        <p className="font-medium italic">Hiện tại chưa có sự kiện nào được ghi lại.</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Info size={40} strokeWidth={1} />
                        <p className="font-medium italic">Không tìm thấy sự kiện nào khớp với tiêu chí tìm kiếm.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => {
                    const eventBadge = getEventBadge(log.event_type);
                    return (
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
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${eventBadge.classes}`}>
                            <AlertCircle size={12} />
                            {eventBadge.label}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg ${log.user_id ? 'bg-indigo-50 text-indigo-500' : 'bg-slate-50 text-slate-400'}`}>
                              <UserIcon size={14} />
                            </div>
                            <span className={`text-sm font-bold ${log.user_id ? 'text-slate-700' : 'text-slate-400 italic'}`}>
                              {log.user_id?.username || "Hệ thống"}
                            </span>
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
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="text-center text-xs text-slate-400 font-medium">
        Tự động cập nhật mỗi khi có sự kiện mới được ghi nhận trong hệ thống.
      </div>
    </div>
  );
}
