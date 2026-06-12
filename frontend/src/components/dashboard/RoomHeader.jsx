import { Droplets, ThermometerSun, Sun } from "lucide-react";

export default function RoomHeader({ temp = "--", humidity = "--", light = "--", username = "User", motionAlert = null }) {
  return (
    <div className="flex items-center justify-between mt-2">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold text-slate-800">{username}'s Home</h2>
        {motionAlert && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full border border-red-100 text-xs font-bold animate-pulse shadow-sm shadow-red-100/50 relative">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <span>Cảnh báo chuyển động: {motionAlert.room}</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1 text-slate-600 font-semibold">
          <Droplets size={16} className="text-blue-400" />
          <span>{humidity}%</span>
        </div>
        <div className="flex items-center gap-1 text-slate-600 font-semibold">
          <ThermometerSun size={16} className="text-orange-400" />
          <span>{temp}°C</span>
        </div>
        <div className="flex items-center gap-1 text-slate-600 font-semibold">
          <Sun size={16} className="text-yellow-500" />
          <span>{light} lux</span>
        </div>
      </div>
    </div>
  );
}
