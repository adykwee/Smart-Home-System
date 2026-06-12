import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Home,
  LayoutGrid,
  LampDesk,
  ShieldCheck,
  Timer,
  Users,
  BarChart2,
  LogOut
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Thiết bị", path: "/devices", icon: LayoutGrid },
    { name: "Trạng thái thiết bị", path: "/device-status", icon: LampDesk },
    { name: "Cảnh báo", path: "/alerts", icon: ShieldCheck },
    { name: "Lịch trình", path: "/schedules", icon: Timer },
    { name: "Người dùng", path: "/users", icon: Users },
    { name: "Nhật ký", path: "/logs", icon: BarChart2 },
  ];

  return (
    <aside className="w-[100px] bg-[#7048e8] flex flex-col items-center py-8 z-20 rounded-r-[40px] shadow-[10px_0_30px_rgba(112,72,232,0.15)] relative">
      <nav className="flex-1 flex flex-col items-center gap-4 w-full mt-10">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
          
          return (
            <div key={link.path} className="relative w-full flex justify-end h-16">
              {isActive && (
                <>
                  <div className="absolute top-0 right-0 w-[calc(100%-16px)] h-full bg-[#f4f5f9] rounded-l-[24px]"></div>
                </>
              )}
              <NavLink
                to={link.path}
                className={`relative z-10 w-[calc(100%-16px)] flex items-center justify-center h-full rounded-l-[24px] transition-colors ${
                  isActive
                    ? "text-[#7048e8]"
                    : "text-white/60 hover:text-white"
                }`}
                title={link.name}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </NavLink>
            </div>
          );
        })}
      </nav>

      <div className="w-full flex justify-center pb-4">
        <button 
          onClick={handleLogout}
          className="text-white/60 hover:text-white transition-colors p-3" 
          title="Đăng xuất"
        >
          <LogOut size={24} strokeWidth={2} />
        </button>
      </div>
    </aside>
  );
}
