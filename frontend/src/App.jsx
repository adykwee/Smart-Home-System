import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const socket = io(SOCKET_URL);

function App() {
  const [temperature, setTemperature] = useState("--");
  const [isLedOn, setIsLedOn] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket.on("connect", () => console.log("Đã kết nối với Backend"));

    // Lắng nghe dữ liệu cảm biến (Nhiệt độ)
    socket.on("sensor_data", (data) => {
      if (data.type === "nhiet-do") setTemperature(data.value);
    });

    // Lắng nghe trạng thái thực tế của phần cứng để cập nhật nút bấm
    socket.on("device_status", (data) => {
      if (data.type === "den-led") {
        setLoading(false); // Tắt hiệu ứng quay vòng
        setIsLedOn(data.status === "1");
      }
    });

    return () => {
      socket.off("connect");
      socket.off("sensor_data");
      socket.off("device_status");
    };
  }, []);

  const toggleLed = () => {
    setLoading(true);
    const command = isLedOn ? "OFF" : "ON";
    // Gửi lệnh xuống Backend
    socket.emit("control_device", { device: "den-led", command });

    // Fail-safe: Nếu sau 3 giây không nhận được phản hồi, tự tắt loading
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">
          Smart Home POC
        </h1>

        {/* Khối hiển thị Nhiệt độ */}
        <div className="mb-8">
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide">
            Nhiệt độ phòng
          </p>
          <div className="text-6xl font-extrabold text-blue-600 mt-2">
            {temperature}
            <span className="text-3xl text-blue-400">°C</span>
          </div>
        </div>

        {/* Khối Nút điều khiển */}
        <div className="border-t border-slate-200 pt-6">
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide mb-4">
            Điều khiển Đèn
          </p>
          <button
            onClick={toggleLed}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 shadow-md flex justify-center items-center gap-2
              ${
                loading
                  ? "bg-slate-400 cursor-not-allowed"
                  : isLedOn
                    ? "bg-red-500 hover:bg-red-600 shadow-red-500/30"
                    : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30"
              }`}
          >
            {loading ? (
              <span>Đang chờ thiết bị...</span>
            ) : isLedOn ? (
              "Tắt Đèn"
            ) : (
              "Bật Đèn"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
