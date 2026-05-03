import { useEffect, useState } from "react";
import { usePage } from "../contexts/PageContext";
import axios from "axios";
import { Trash2, Shield, User as UserIcon } from "lucide-react";

export default function Users() {
  const { setTitle } = usePage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTitle("Người dùng");
    fetchUsers();
  }, [setTitle]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/users");
      if (res.data.status === "success") {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/v1/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      alert("Lỗi khi xóa người dùng");
    }
  };

  const handleRoleChange = async (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await axios.put(`http://localhost:5000/api/v1/users/${id}`, { role: newRole });
      setUsers(users.map((u) => (u._id === id ? { ...u, role: newRole } : u)));
    } catch (error) {
      console.error("Lỗi khi cập nhật quyền:", error);
      alert("Lỗi khi cập nhật quyền");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Danh sách tài khoản</h2>
            <p className="text-sm text-slate-500">Quản lý quyền truy cập hệ thống</p>
          </div>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-slate-500">Đang tải dữ liệu...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Tài khoản</th>
                  <th className="px-6 py-4 font-semibold">Vai trò</th>
                  <th className="px-6 py-4 font-semibold">Ngày tạo</th>
                  <th className="px-6 py-4 font-semibold text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {user.role === 'admin' ? <Shield size={18} /> : <UserIcon size={18} />}
                        </div>
                        <span className="font-semibold text-slate-800">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'}`}>
                        {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleRoleChange(user._id, user.role)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                          Đổi quyền
                        </button>
                        <button 
                          onClick={() => handleDelete(user._id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                      Chưa có người dùng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
