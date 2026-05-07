import { useEffect, useState } from "react";
import { usePage } from "../contexts/PageContext";
import { useAuth } from "../contexts/AuthContext";
import apiClient from "../services/api";
import { 
  UserPlus, 
  Trash2, 
  Edit2, 
  Shield, 
  User as UserIcon, 
  Search, 
  RefreshCw,
  X,
  Check,
  History,
  Clock,
  Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const { setTitle } = usePage();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [recentLogs, setRecentLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "user"
  });

  useEffect(() => {
    setTitle("Danh sách thành viên");
    fetchUsers();
    fetchRecentLogs();
  }, [setTitle]);

  const fetchRecentLogs = async () => {
    try {
      setLogsLoading(true);
      const res = await apiClient.get("/system-logs");
      const allLogs = res.data?.data || [];
      // Lấy 10 logs gần nhất
      setRecentLogs(allLogs.slice(0, 10));
    } catch (error) {
      console.error("Lỗi tải nhật ký:", error);
    } finally {
      setLogsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/users");
      setUsers(res.data?.data || []);
    } catch (error) {
      console.error("Lỗi tải danh sách người dùng:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        password: "", // Không hiển thị mật khẩu cũ
        role: user.role
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: "",
        password: "",
        role: "user"
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Update user
        const updateData = { role: formData.role };
        if (formData.password) updateData.password = formData.password;
        
        await apiClient.put(`/users/${editingUser._id}`, updateData);
      } else {
        // Create user
        await apiClient.post("/users", formData);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const handleDelete = async (id) => {
    if (id === currentUser._id) {
      alert("Bạn không thể tự xóa chính mình!");
      return;
    }
    
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        await apiClient.delete(`/users/${id}`);
        fetchUsers();
      } catch (error) {
        alert("Lỗi khi xóa người dùng");
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && users.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-20 gap-4">
        <RefreshCw size={40} className="animate-spin text-indigo-500" />
        <p className="font-bold text-slate-400">Đang truy xuất dữ liệu người dùng...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm thành viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-slate-100 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
          />
        </div>
        
        {currentUser?.role === 'admin' && (
          <button 
            onClick={() => handleOpenModal()}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            <UserPlus size={18} />
            Thêm người dùng mới
          </button>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Thành viên</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Vai trò</th>
                {currentUser?.role === 'admin' && (
                  <>
                    <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">ID hệ thống</th>
                    <th className="px-8 py-5 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">Thao tác</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-slate-400 italic">
                    Không tìm thấy người dùng nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm ${
                          u.role === 'admin' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'
                        }`}>
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{u.username}</p>
                          <p className="text-xs text-slate-400 font-medium">Thành viên từ {new Date(u.createdAt).toLocaleDateString('vi-VN')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider ${
                        u.role === 'admin' 
                          ? 'bg-amber-50 text-amber-600 border border-amber-100' 
                          : 'bg-slate-50 text-slate-600 border border-slate-100'
                      }`}>
                        {u.role === 'admin' ? <Shield size={12} /> : <UserIcon size={12} />}
                        {u.role}
                      </span>
                    </td>
                    {currentUser?.role === 'admin' && (
                      <>
                        <td className="px-8 py-4">
                          <code className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                            {u._id}
                          </code>
                        </td>
                        <td className="px-8 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleOpenModal(u)}
                              className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                              title="Sửa"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(u._id)}
                              className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                              title="Xóa"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-300 relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-2xl font-bold text-slate-800 mb-6">
              {editingUser ? "Chỉnh sửa tài khoản" : "Tạo tài khoản mới"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Tên đăng nhập</label>
                <input 
                  type="text" 
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  disabled={editingUser !== null}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Nhập tên đăng nhập..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  {editingUser ? "Mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu"}
                </label>
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="********"
                  required={editingUser === null}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Vai trò</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, role: 'user'})}
                    className={`flex items-center justify-center gap-2 py-3 rounded-2xl border-2 transition-all font-bold ${
                      formData.role === 'user' 
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-600' 
                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    <UserIcon size={16} />
                    User
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, role: 'admin'})}
                    className={`flex items-center justify-center gap-2 py-3 rounded-2xl border-2 transition-all font-bold ${
                      formData.role === 'admin' 
                        ? 'bg-amber-50 border-amber-600 text-amber-600' 
                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    <Shield size={16} />
                    Admin
                  </button>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  {editingUser ? "Cập nhật" : "Tạo ngay"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recent Activity Section */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500">
              <Activity size={20} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Hoạt động gần đây</h3>
          </div>
          <button 
            onClick={fetchRecentLogs}
            className="text-indigo-600 hover:text-indigo-700 font-bold text-sm flex items-center gap-2"
          >
            <RefreshCw size={14} className={logsLoading ? "animate-spin" : ""} />
            Làm mới
          </button>
        </div>

        <div className="space-y-4">
          {logsLoading && recentLogs.length === 0 ? (
            <p className="text-center py-10 text-slate-400 italic">Đang tải hoạt động...</p>
          ) : recentLogs.length === 0 ? (
            <p className="text-center py-10 text-slate-400 italic">Chưa có hoạt động nào được ghi nhận.</p>
          ) : (
            recentLogs.map((log) => (
              <div key={log._id} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                <div className={`mt-1 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  log.event_type === 'ALERT' ? 'bg-rose-50 text-rose-500' : 'bg-slate-100 text-slate-500'
                }`}>
                  {log.event_type === 'ALERT' ? <Activity size={16} /> : <Clock size={16} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-slate-700">
                      {log.description}
                    </p>
                    <span className="text-[10px] font-bold text-slate-400 uppercase whitespace-nowrap bg-slate-50 px-2 py-0.5 rounded-md">
                      {new Date(log.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-indigo-500">
                      {log.user_id?.username || "Hệ thống"}
                    </span>
                    <span className="text-slate-300 text-xs">•</span>
                    <span className="text-xs text-slate-400">
                      {new Date(log.created_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
