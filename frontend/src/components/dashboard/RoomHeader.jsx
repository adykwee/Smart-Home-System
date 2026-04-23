import { Droplets, ThermometerSun, ChevronDown } from "lucide-react";

export default function RoomHeader({ temp = "--", humidity = "--" }) {
  return (
    <div className="flex items-center justify-between mt-2">
      <h2 className="text-2xl font-bold text-slate-800">Scarlett's Home</h2>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1 text-slate-600 font-semibold">
          <Droplets size={16} className="text-blue-400" />
          <span>{humidity}%</span>
        </div>
        <div className="flex items-center gap-1 text-slate-600 font-semibold">
          <ThermometerSun size={16} className="text-orange-400" />
          <span>{temp}°C</span>
        </div>
        <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 shadow-sm hover:shadow">
          Living Room
          <ChevronDown size={16} className="text-slate-400" />
        </button>
      </div>
    </div>
  );
}
