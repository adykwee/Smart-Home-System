import { useEffect, useState } from "react";
import { usePage } from "../contexts/PageContext";
import { useAuth } from "../contexts/AuthContext";
import { User, Shield, LogOut, Lock } from "lucide-react";
import apiClient from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { setTitle } = usePage();
  const { user, logout, updateUserData } = useAuth();
  const navigate = useNavigate();

  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMessage, setPwdMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    setTitle("Cài đặt hệ thống");
  }, [setTitle]);

  useEffect(() => {
    if (user?.username) {
      setNewUsername(user.username);
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMessage({ type: "", text: "" });

    if (!newUsername.trim()) {
      setProfileMessage({ type: "error", text: "Tên đăng nhập không được bỏ trống!" });
      return;
    }

    try {
      setProfileLoading(true);
      const res = await apiClient.put("/users/update-profile", {
        username: newUsername
      });
      
      updateUserData(res.data.data);
      setProfileMessage({ type: "success", text: "Cập nhật tên tài khoản thành công!" });
    } catch (error) {
      setProfileMessage({
        type: "error",
        text: error.response?.data?.message || "Đổi tên thất bại. Tên đăng nhập có thể đã tồn tại!"
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdMessage({ type: "", text: "" });

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPwdMessage({ type: "error", text: "Vui lòng nhập đầy đủ thông tin!" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdMessage({ type: "error", text: "Mật khẩu mới không trùng khớp!" });
      return;
    }

    if (newPassword.length < 6) {
      setPwdMessage({ type: "error", text: "Mật khẩu mới phải dài ít nhất 6 ký tự!" });
      return;
    }

    try {
      setPwdLoading(true);
      const res = await apiClient.put("/users/change-password", {
        oldPassword,
        newPassword
      });
      setPwdMessage({ type: "success", text: res.data?.message || "Đổi mật khẩu thành công!" });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPwdMessage({
        type: "error",
        text: error.response?.data?.message || "Đổi mật khẩu thất bại. Vui lòng thử lại!"
      });
    } finally {
      setPwdLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-full h-full p-6 animate-fade-in flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cột trái: Thông tin tài khoản */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center">
            <div className="w-24 h-24 bg-indigo-50 border-4 border-indigo-100 rounded-full flex items-center justify-center mb-4 text-[#7048e8] font-bold text-3xl uppercase">
              {user?.username ? user.username.charAt(0) : "U"}
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">{user?.username || "Tài khoản"}</h3>
            <p className="text-xs font-bold text-slate-400 capitalize mb-6 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
              {user?.role === "admin" ? "Quản trị viên" : "Thành viên"}
            </p>
            
            <form onSubmit={handleUpdateProfile} className="w-full space-y-4 pt-4 border-t border-slate-100">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Tên đăng nhập (Username)</label>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Nhập tên đăng nhập mới"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  />
                  <User className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
                </div>
              </div>

              {profileMessage.text && (
                <p className={`text-xs font-bold text-center ${
                  profileMessage.type === "success" ? "text-emerald-500" : "text-rose-500"
                }`}>
                  {profileMessage.text}
                </p>
              )}

              <button 
                type="submit"
                disabled={profileLoading || newUsername === user?.username}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-2xl text-xs transition-all active:scale-[0.98] disabled:bg-slate-100 disabled:text-slate-400"
              >
                {profileLoading ? "Đang xử lý..." : "Cập nhật tên tài khoản"}
              </button>
            </form>

            <div className="w-full border-t border-slate-100 mt-6 pt-6 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Mã định danh ID</span>
                <span className="text-slate-700 font-bold truncate max-w-[150px]">{user?._id || "N/A"}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Trạng thái kết nối</span>
                <span className="text-emerald-500 font-bold flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Hoạt động
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="bg-rose-50 text-rose-600 font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-rose-100 transition-all border border-rose-100 active:scale-[0.98] shadow-sm hover:shadow-rose-100"
          >
            <LogOut size={18} />
            Đăng xuất tài khoản
          </button>
        </div>

        {/* Cột phải: Form đổi mật khẩu */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-50 rounded-2xl text-[#7048e8]">
                <Shield size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Đổi mật khẩu bảo mật</h3>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Mật khẩu hiện tại</label>
                <div className="relative">
                  <input 
                    type="password"
                    placeholder="Nhập mật khẩu cũ"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3.5 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  />
                  <Lock className="absolute left-3.5 top-4 text-slate-400 w-4 h-4" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Mật khẩu mới</label>
                  <div className="relative">
                    <input 
                      type="password"
                      placeholder="Mật khẩu mới (ít nhất 6 ký tự)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3.5 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    />
                    <Lock className="absolute left-3.5 top-4 text-slate-400 w-4 h-4" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Xác nhận mật khẩu mới</label>
                  <div className="relative">
                    <input 
                      type="password"
                      placeholder="Nhập lại mật khẩu mới"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3.5 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    />
                    <Lock className="absolute left-3.5 top-4 text-slate-400 w-4 h-4" />
                  </div>
                </div>
              </div>

              {pwdMessage.text && (
                <div className={`p-4 rounded-2xl text-sm font-bold ${
                  pwdMessage.type === "success" 
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                    : "bg-rose-50 text-rose-600 border border-rose-100"
                }`}>
                  {pwdMessage.text}
                </div>
              )}

              <button 
                type="submit"
                disabled={pwdLoading}
                className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 active:scale-[0.98] disabled:bg-slate-300"
              >
                {pwdLoading ? "Đang đổi mật khẩu..." : "Cập nhật mật khẩu"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
