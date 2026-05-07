import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f5f9]">
        <div className="w-10 h-10 border-4 border-[#7048e8] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Nếu chưa có user thì chuyển hướng về /login
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
