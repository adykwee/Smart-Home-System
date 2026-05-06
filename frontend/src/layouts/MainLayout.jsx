import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutGrid,
  Activity,
  Cpu,
  FileText,
  Calendar,
  AlertTriangle,
  Users,
  Settings,
  Bell,
  LogOut,
} from "lucide-react";
import { usePage } from "../contexts/PageContext";
import { useAuth } from "../contexts/AuthContext";

export default function MainLayout() {
  const { title } = usePage();
  const { user, logout } = useAuth();
  const links = [
    { name: "Dashboard", path: "/", icon: LayoutGrid },
    { name: "Trạng thái", path: "/device-status", icon: Activity },
    { name: "Thiết bị", path: "/devices", icon: Cpu },
    { name: "Nhật ký", path: "/logs", icon: FileText },
    { name: "Ngưỡng", path: "/thresholds", icon: AlertTriangle },
    { name: "Người dùng", path: "/users", icon: Users },
  ];

  return (
    <div className="flex h-screen font-sans text-slate-800 bg-slate-100">
      {/* Sidebar - Khớp thiết kế xanh navy (Deep Navy) */}
      <aside className="w-64 flex flex-col bg-slate-900 border-r border-slate-800">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex-shrink-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Smart Home App</h1>
        </div>

        <div className="px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-2 mb-3">
          Chính
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {links.slice(0, 5).map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                <Icon size={20} strokeWidth={2.5} />
                {link.name}
              </NavLink>
            );
          })}

          <div className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-8 mb-3">
            Quản trị
          </div>
          {links.slice(5).map((link) => {
            // Ẩn menu Người dùng nếu không phải admin
            if (link.path === "/users" && user?.role !== "admin") return null;

            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                <Icon size={20} strokeWidth={2.5} />
                {link.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Sidebar (Hệ thống trạng thái viên thuốc) */}
        <div className="p-4 m-4 rounded-xl bg-slate-800/80 border border-slate-700/50 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </div>
            <span className="text-sm font-semibold text-emerald-400">Hệ thống hoạt động</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b border-slate-200/50 flex items-center justify-between px-8 bg-white/70 backdrop-blur-md sticky top-0 z-10 transition-all">
          <div className="text-xl font-bold text-slate-800 uppercase tracking-tight">
            {title}
          </div>
          <div className="flex items-center gap-5">
            {/* Notification Bell */}
            <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition">
              <Bell size={20} />
              <span className="absolute top-1 right-1.5 w-2 h-2 bg-emerald-500 border-2 border-white rounded-full"></span>
            </button>

            <div className="w-px h-6 bg-slate-200 mx-1"></div>

            {/* User Profile */}
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 ring-2 ring-transparent group-hover:ring-indigo-100 transition">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-slate-800 leading-tight">{user?.username}</p>
                <p className="text-xs text-slate-500 leading-tight">{user?.role === "admin" ? "Quản trị viên" : "Người dùng"}</p>
              </div>
            </div>

            {/* Log Out */}
            <button
              onClick={logout}
              className="flex items-center gap-2 text-rose-500 text-sm font-semibold ml-2 hover:bg-rose-50 px-3 py-2 rounded-lg transition-colors"
            >
              <LogOut size={18} strokeWidth={2.5} />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
