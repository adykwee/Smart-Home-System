import { useEffect, useState } from "react";
import { usePage } from "../contexts/PageContext";
import { User, Shield, Bell, Monitor, Save, LogOut } from "lucide-react";

export default function Settings() {
  const { setTitle } = usePage();
  const [profile, setProfile] = useState({
    name: "Scarlett",
    email: "admin@smarthome.com",
    role: "Administrator"
  });

  useEffect(() => {
    setTitle("Cài đặt hệ thống");
  }, [setTitle]);

  return (
    <div className="w-full h-full p-6 animate-fade-in flex flex-col gap-8">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <User size={40} className="text-[#7048e8]" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">{profile.name}</h3>
            <p className="text-sm text-slate-500 mb-6">{profile.role}</p>
            
            <div className="w-full border-t border-slate-50 pt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Email</span>
                <span className="text-slate-700 font-medium">{profile.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Trạng thái</span>
                <span className="text-emerald-500 font-bold flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  Online
                </span>
              </div>
            </div>
          </div>

          <button className="bg-rose-50 text-rose-500 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-rose-100 transition-all border border-rose-100">
            <LogOut size={18} />
            Đăng xuất
          </button>
        </div>

        {/* Settings Sections */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Account Settings */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-indigo-50 rounded-2xl text-[#7048e8]">
                <Shield size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Bảo mật & Tài khoản</h3>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="font-bold text-slate-800">Xác thực 2 lớp (2FA)</p>
                  <p className="text-xs text-slate-500">Tăng cường bảo mật cho tài khoản của bạn</p>
                </div>
                <div className="w-12 h-6 bg-slate-200 rounded-full p-1 cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="font-bold text-slate-800">Lịch sử đăng nhập</p>
                  <p className="text-xs text-slate-500">Xem các thiết bị đã truy cập hệ thống</p>
                </div>
                <button className="text-xs font-bold text-[#7048e8] hover:underline">Chi tiết</button>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-indigo-50 rounded-2xl text-[#7048e8]">
                <Monitor size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Thông tin hệ thống</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-slate-400 mb-1 uppercase text-[10px] font-bold">Phiên bản</p>
                <p className="font-bold text-slate-700">v2.1.0-alpha</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-slate-400 mb-1 uppercase text-[10px] font-bold">Trình duyệt</p>
                <p className="font-bold text-slate-700">Chrome 123.0</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-slate-400 mb-1 uppercase text-[10px] font-bold">Uptime</p>
                <p className="font-bold text-slate-700">12 ngày 4 giờ</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-slate-400 mb-1 uppercase text-[10px] font-bold">Lưu trữ</p>
                <p className="font-bold text-slate-700">45% / 10GB</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
