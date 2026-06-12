import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Home, ShieldCheck, LogOut } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { name: "Bật/Tắt Thiết Bị", path: "/", icon: Home },
    { name: "Cài Đặt Ngưỡng", path: "/alerts", icon: ShieldCheck },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full z-20">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-slate-100">
        <span className="text-lg font-bold text-slate-800 tracking-wide uppercase">
          Smart Home
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <Icon size={20} strokeWidth={2} className={isActive ? "text-slate-900" : "text-slate-400"} />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-slate-100">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
          title="Đăng xuất"
        >
          <LogOut size={20} strokeWidth={2} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
