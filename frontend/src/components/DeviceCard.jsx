import { Fan, Lightbulb, Thermometer, Droplets, HelpCircle, Trash2, Settings, Sun, Activity } from "lucide-react";

const DeviceCard = ({ device, onToggle, onDelete, onEdit, isUpdating }) => {
  const isFan = device.name?.toLowerCase().includes("quạt") || 
                device.name?.toLowerCase().includes("fan") || 
                device.feed_key?.toLowerCase().includes("fan");

  const currentSpeed = Number(device.current_status);
  const isOn = isFan 
    ? (device.current_status === "ON" || (!isNaN(currentSpeed) && currentSpeed >= 10))
    : device.current_status === "ON";

  const getIcon = (name) => {
    const lowerName = name?.toLowerCase();

    // Check for keywords (substring matching)
    if (lowerName?.includes("quạt") || lowerName?.includes("fan")) {
      return <Fan className={isOn ? "animate-spin-slow" : ""} />;
    }
    if (lowerName?.includes("đèn") || lowerName?.includes("light") || lowerName?.includes("led")) return <Lightbulb />;
    if (lowerName?.includes("nhiệt") || lowerName?.includes("temp")) return <Thermometer />;
    if (lowerName?.includes("ẩm") || lowerName?.includes("humid")) return <Droplets />;
    if (lowerName?.includes("ánh sáng") || lowerName?.includes("light") || lowerName?.includes("lux")) return <Sun />;
    if (lowerName?.includes("motion") || lowerName?.includes("chuyển động") || lowerName?.includes("chuyen dong")) return <Activity />;

    return <HelpCircle />;
  };

  return (
    <div className={`relative group overflow-hidden rounded-3xl transition-all duration-500 ${
      isOn 
        ? "bg-gradient-to-br from-indigo-600 to-violet-700 shadow-xl shadow-indigo-500/20 ring-1 ring-white/20" 
        : "bg-white/70 backdrop-blur-xl border border-slate-200 hover:border-indigo-300 shadow-sm"
    }`}>
      {/* Background Glow for ON state */}
      {isOn && (
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
      )}

      {/* Action Buttons (Visible on hover) */}
      <div className="absolute bottom-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(device); }}
          className="p-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 shadow-lg shadow-indigo-500/30"
          title="Chỉnh sửa"
        >
          <Settings size={14} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(device._id || device.id); }}
          className="p-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 shadow-lg shadow-rose-500/30"
          title="Xóa thiết bị"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="p-6 flex flex-col h-full gap-4">
        <div className="flex justify-between items-start">
          <div className={`p-3 rounded-2xl transition-colors duration-300 ${
            isOn ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-600"
          }`}>
            {getIcon(device.name)}
          </div>
          
          {device.type === "Sensor" ? (
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              isOn ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
            }`}>
              Monitoring
            </div>
          ) : (
            <button
              onClick={() => onToggle(device)}
              disabled={isUpdating}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isOn ? "bg-emerald-400 focus:ring-emerald-500" : "bg-slate-200 focus:ring-indigo-500"
              } ${isUpdating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${
                  isOn ? "translate-x-6 shadow-sm" : "translate-x-1 shadow-md"
                }`}
              />
            </button>
          )}
        </div>

        <div className="mt-auto">
          <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
            isOn ? "text-indigo-100" : "text-slate-400"
          }`}>
            {device.room || "Chưa gán phòng"} • {device.type}
          </p>
          <h3 className={`text-xl font-bold truncate ${
            isOn ? "text-white" : "text-slate-800"
          }`}>
            {device.name}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${
              (isOn || device.type === "Sensor") ? "bg-emerald-300 animate-pulse" : "bg-slate-300"
            }`}></div>
            <span className={`text-sm font-medium ${
              (isOn || device.type === "Sensor") ? (isOn ? "text-indigo-100" : "text-emerald-600") : "text-slate-500"
            }`}>
              {device.type === "Sensor" 
                ? (() => {
                    const name = device.name?.toLowerCase() || "";
                    const key = device.feed_key?.toLowerCase() || "";
                    if (name.includes("temp") || name.includes("nhiệt") || key.includes("temp") || key.includes("nhiet")) {
                      return `Nhiệt độ: ${device.current_status || "--"}°C`;
                    }
                    if (name.includes("humid") || name.includes("ẩm") || key.includes("humid") || key.includes("doam")) {
                      return `Độ ẩm: ${device.current_status || "--"}%`;
                    }
                    if (name.includes("light") || name.includes("ánh sáng") || key.includes("light") || key.includes("anhsang")) {
                      return `Ánh sáng: ${device.current_status || "--"} Lux`;
                    }
                    if (name.includes("motion") || name.includes("chuyển động") || name.includes("chuyen dong") || key.includes("motion") || key.includes("chuyen-dong")) {
                      return (device.current_status === "1" || device.current_status === 1 || String(device.current_status).toLowerCase() === "active" || String(device.current_status).toLowerCase() === "true")
                        ? "Phát hiện chuyển động"
                        : "Trạng thái: Yên tĩnh";
                    }
                    return `Đang giám sát: ${device.current_status || "--"}`;
                  })()
                : (isOn ? "Đang bật" : "Đã tắt")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceCard;
