import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alerts";
import Login from "./pages/Login";
import { PageProvider } from "./contexts/PageContext";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <PageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<PrivateRoute />}>
              <Route element={<MainLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="alerts" element={<Alerts />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </PageProvider>
    </AuthProvider>
  );
}

export default App;
