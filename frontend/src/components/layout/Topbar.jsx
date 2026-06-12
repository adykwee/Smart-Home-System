import { useAuth } from "../../contexts/AuthContext";

export default function Topbar() {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
      {/* Page Title Placeholder / Welcome Message */}
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Bảng Điều Khiển Hệ Thống</h1>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col text-right">
          <span className="text-sm font-bold text-slate-800">{user?.username || 'User'}</span>
          <span className="text-xs text-slate-500 capitalize">{user?.role || 'Guest'}</span>
        </div>
        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
          <span className="text-slate-600 font-bold text-sm uppercase">
            {user?.username ? user.username.charAt(0) : 'U'}
          </span>
        </div>
      </div>
    </header>
  );
}
