import { NavLink, useNavigate } from "react-router-dom";
import { Search, Settings, Bell, ChevronDown, LogOut, Clock, AlertCircle, Info } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import apiClient from "../../services/api";

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fetchRecentLogs = async () => {
    try {
      setLoadingLogs(true);
      const res = await apiClient.get("/system-logs");
      const data = res.data;
      const logs = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
      setRecentLogs(logs.slice(0, 5));
    } catch (error) {
      console.error("Lỗi tải thông báo:", error);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleNotifClick = () => {
    if (!notifOpen) {
      fetchRecentLogs();
    }
    setNotifOpen(!notifOpen);
  };
  return (
    <header className="h-24 flex items-center justify-between px-10 pt-4 z-10">
      <div className="relative w-[400px]">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-4 py-3 bg-white border-none rounded-2xl text-sm placeholder-slate-400 focus:ring-2 focus:ring-[#7048e8]/20 focus:outline-none shadow-sm"
          placeholder="Search"
        />
      </div>

      <div className="flex items-center gap-6">
        <NavLink to="/settings" className="p-2 text-slate-600 hover:text-[#7048e8] hover:bg-white rounded-full transition cursor-pointer">
          <Settings size={22} strokeWidth={2} />
        </NavLink>
        <div className="relative" ref={notifRef}>
          <button 
            onClick={handleNotifClick}
            className="relative p-2 text-slate-600 hover:text-[#7048e8] hover:bg-white rounded-full transition"
          >
            <Bell size={22} strokeWidth={2} />
            {recentLogs.length > 0 && !notifOpen && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 border-2 border-[#f4f5f9] rounded-full"></span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute top-full mt-2 right-0 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-800">Thông báo mới</h3>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-lg font-bold">Mới nhất</span>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {loadingLogs ? (
                  <div className="p-8 text-center text-slate-400 text-sm">Đang tải...</div>
                ) : recentLogs.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-sm">Không có thông báo nào.</div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {recentLogs.map(log => (
                      <div key={log._id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                        <div className="flex gap-3">
                          <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            log.event_type === 'ALERT' ? 'bg-rose-50 text-rose-500' : 'bg-indigo-50 text-indigo-500'
                          }`}>
                            {log.event_type === 'ALERT' ? <AlertCircle size={14} /> : <Info size={14} />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-700 line-clamp-2">{log.description}</p>
                            <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-400">
                              <Clock size={12} />
                              <span>
                                {new Date(log.created_at).toLocaleString("vi-VN", {
                                  hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                <button 
                   onClick={() => {
                    setNotifOpen(false);
                    navigate('/logs');
                  }}
                  className="w-full py-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-colors"
                >
                  Xem tất cả
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={dropdownRef}>
          <div 
            className="flex items-center gap-3 ml-2 cursor-pointer bg-white py-1.5 px-2.5 pr-4 rounded-full shadow-sm hover:shadow transition"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="w-10 h-10 rounded-full border-2 border-indigo-100 bg-indigo-50 flex items-center justify-center overflow-hidden">
              <span className="text-[#7048e8] font-bold text-lg uppercase">
                {user?.username ? user.username.charAt(0) : 'U'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800 truncate max-w-[100px]">{user?.username || 'User'}</span>
              <span className="text-xs text-slate-500 capitalize">{user?.role || 'Guest'}</span>
            </div>
            <ChevronDown size={16} className={`text-slate-400 ml-1 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {dropdownOpen && (
            <div className="absolute top-full mt-2 right-0 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut size={16} />
                <span className="font-medium">Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
