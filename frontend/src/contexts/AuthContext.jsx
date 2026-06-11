import { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Khôi phục user từ token (nếu có API /me, nếu không thì lấy từ localStorage tạm)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await apiClient.post('/users/login', { username, password });
      const { data } = response.data;
      
      const userData = { _id: data._id, username: data.username, role: data.role };
      const userToken = data.token;
      
      setUser(userData);
      setToken(userToken);
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userToken);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.' 
      };
    }
  };

  const register = async (username, password) => {
    try {
      const response = await apiClient.post('/users/register', { username, password });
      const { data } = response.data;
      
      const userData = { _id: data._id, username: data.username, role: data.role };
      const userToken = data.token;
      
      setUser(userData);
      setToken(userToken);
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userToken);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateUserData = (data) => {
    const userData = { _id: data._id, username: data.username, role: data.role };
    const userToken = data.token;
    
    setUser(userData);
    setToken(userToken);
    
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
