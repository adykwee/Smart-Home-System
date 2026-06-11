import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { io } from "socket.io-client";
import { AlertTriangle, X } from "lucide-react";
import { usePage } from "../contexts/PageContext";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || "http://localhost:5000";

export default function MainLayout() {
  const { title } = usePage();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("alert", (data) => {
      // Còi báo động dùng Web Audio API
      const soundEnabled = localStorage.getItem("setting_sound_alert") !== "false";
      if (soundEnabled) {
        try {
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          const playBeep = (delay, frequency, duration) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = "sine";
            osc.frequency.setValueAtTime(frequency, audioCtx.currentTime + delay);
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + duration - 0.02);
            osc.start(audioCtx.currentTime + delay);
            osc.stop(audioCtx.currentTime + delay + duration);
          };
          // Bíp 2 tiếng
          playBeep(0, 880, 0.12);
          playBeep(0.18, 880, 0.12);
        } catch (e) {
          console.warn(e);
        }
      }

      // Hiển thị toast notification
      const toastEnabled = localStorage.getItem("setting_toast_alert") !== "false";
      if (toastEnabled) {
        const newAlert = {
          id: Date.now(),
          message: data.message,
          time: new Date().toLocaleTimeString()
        };
        setAlerts(prev => [newAlert, ...prev].slice(0, 5));
        setTimeout(() => {
          setAlerts(prev => prev.filter(a => a.id !== newAlert.id));
        }, 5000);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const dismissAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="flex h-screen font-sans text-slate-800 bg-[#f4f5f9] relative overflow-hidden">
      
      {/* Toast box */}
      <div className="absolute top-20 right-8 z-50 flex flex-col gap-2">
        {alerts.map(alert => (
          <div key={alert.id} className="bg-rose-500 text-white px-4 py-3 rounded-xl shadow-lg shadow-rose-500/30 flex items-start gap-3 animate-slide-in-right max-w-sm">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold mb-0.5">Cảnh báo ngưỡng!</p>
              <p className="text-xs text-rose-100">{alert.message}</p>
            </div>
            <button onClick={() => dismissAlert(alert.id)} className="text-rose-200 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Topbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto px-10 pb-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
