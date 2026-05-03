import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setToken(null);
  };

  // Cấu hình axios header mặc định nếu có token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
      
      // Parse token để lấy info user (đây là cách decode đơn giản phần payload)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser({ id: payload.id, role: payload.role });
      } catch {
        console.error("Invalid token format");
        logout();
      }
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = async (username, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/v1/users/login", { username, password });
      if (res.data.status === "success") {
        setToken(res.data.data.token);
        // User sẽ được set trong useEffect khi token thay đổi
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Lỗi đăng nhập" };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
