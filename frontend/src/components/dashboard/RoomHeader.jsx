import { Droplets, ThermometerSun, Sun } from "lucide-react";

export default function RoomHeader({ temp = "--", humidity = "--", light = "--", username = "User" }) {
  return (
    <div className="flex items-center justify-between mt-2">
      <h2 className="text-2xl font-bold text-slate-800">{username}'s Home</h2>
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
