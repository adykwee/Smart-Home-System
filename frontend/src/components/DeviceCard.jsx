import { Fan, Lightbulb, Thermometer, Droplets, HelpCircle, Trash2, Settings } from "lucide-react";

const DeviceCard = ({ device, onToggle, onDelete, onEdit, isUpdating }) => {
  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "fan": return <Fan className={device.current_status === "ON" ? "animate-spin-slow" : ""} />;
      case "light": return <Lightbulb />;
      case "sensor":
      case "temperature": return <Thermometer />;
      case "humidity": return <Droplets />;
      default: return <HelpCircle />;
    }
  };

  const isOn = device.current_status === "ON";

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
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
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
            {getIcon(device.type)}
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
              {device.type === "Sensor" ? "Đang giám sát" : (isOn ? "Đang bật" : "Đã tắt")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceCard;
