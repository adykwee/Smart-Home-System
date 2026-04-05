import { NavLink, Outlet } from "react-router-dom";

export default function MainLayout() {
  const links = [
    { name: "Dashboard", path: "/" },
    { name: "Trạng thái thiết bị", path: "/device-status" },
    { name: "Thiết bị", path: "/devices" },
    { name: "Nhật ký", path: "/logs" },
    { name: "Lịch trình", path: "/schedules" },
    { name: "Cảnh báo", path: "/alerts" },
    { name: "Người dùng", path: "/users" },
    { name: "Cài đặt", path: "/settings" },
  ];

  return (
    <div className="flex h-screen font-sans text-slate-800" style={{ backgroundColor: "#E2E8F0" }}>
      {/* Sidebar - Cố định 250px theo màu xanh đen Figma */}
      <aside className="w-64 flex flex-col" style={{ backgroundColor: "#1e293b" }}>
        <div className="p-6 flex items-center gap-3">
          {/* Logo Placeholder */}
          <div className="w-10 h-10 bg-green-500 rounded-full flex-shrink-0"></div>
          <h1 className="text-xl font-bold text-white leading-tight">Smarthome App</h1>
        </div>
        
        <div className="px-4 text-xs font-semibold text-slate-400 mt-2 mb-2">Chính</div>
        <nav className="flex-1 px-4 space-y-1">
          {links.slice(0, 6).map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive
                    ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          
          <div className="text-xs font-semibold text-slate-400 mt-6 mb-2">Quản trị</div>
          {links.slice(6).map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive
                    ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 m-4 rounded-xl bg-white/10 border border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="text-sm text-slate-200">
              <span className="text-green-400 font-semibold">Hệ thống</span>
              <br />
              <span className="text-xs">Đang chờ dữ liệu...</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-20 border-b border-slate-300/50 flex items-center justify-between px-8 bg-inherit">
          <div className="text-2xl font-bold text-slate-700"></div>
          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-slate-600 transition">🔔</button>
            <div className="flex items-center gap-3 border-l border-slate-300 pl-6 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center font-bold text-slate-600">?</div>
              <div>
                <p className="text-sm font-bold text-slate-800">Người dùng</p>
                <p className="text-xs text-slate-500">Đang chờ dữ liệu</p>
              </div>
            </div>
            <button className="flex items-center gap-2 text-rose-500 font-bold ml-4 hover:bg-rose-50 px-3 py-2 rounded-lg transition">
              <span>Đăng xuất</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
