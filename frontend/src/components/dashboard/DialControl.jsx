import { Zap, Minus, Plus } from "lucide-react";

export default function DialControl({ targetTemp, setTargetTemp }) {
  return (
    <div className="bg-white rounded-3xl p-8 flex flex-col shadow-sm mt-2 relative overflow-hidden">
      <div className="flex justify-between items-center mb-8 relative z-10">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-[#7048e8]" />
          <span className="font-bold text-slate-800">Living Room Temperature</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-800">ON</span>
          <div className="w-10 h-6 bg-[#7048e8] rounded-full p-1 flex items-center cursor-pointer">
            <div className="w-4 h-4 rounded-full bg-white transform translate-x-4"></div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative min-h-[250px]">
        <button 
          onClick={() => setTargetTemp(p => p - 1)}
          className="absolute left-8 lg:left-16 w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
        >
          <Minus size={20} strokeWidth={3} />
        </button>
        <span className="absolute left-24 lg:left-32 text-slate-400 font-semibold text-sm">05°C</span>

        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg className="absolute w-full h-full" viewBox="0 0 100 100">
            {Array.from({ length: 40 }).map((_, i) => {
              const angle = (i * 9) - 180;
              if (angle > 45 && angle < 135) return null;
              const isHighlighted = angle <= (targetTemp - 15) * 6 - 180;
              return (
                <line 
                  key={i}
                  x1="50" y1="5" x2="50" y2="10"
                  transform={`rotate(${angle} 50 50)`}
                  stroke={isHighlighted ? "#7048e8" : "#e2e8f0"}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              )
            })}
          </svg>

          <svg className="absolute w-52 h-52 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="8" strokeDasharray="210 282" strokeLinecap="round" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#gradient)" strokeWidth="8" strokeDasharray={`${(targetTemp-5)*10} 282`} strokeLinecap="round" />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7048e8" />
                <stop offset="100%" stopColor="#ff7b72" />
              </linearGradient>
            </defs>
          </svg>

          <div className="w-40 h-40 bg-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center z-10 border border-slate-50">
            <span className="text-4xl font-bold text-slate-800">{targetTemp}°C</span>
            <span className="text-xs text-slate-400 mt-1">Celcious</span>
          </div>
          
          <span className="absolute -top-6 text-[#7048e8] font-bold text-sm">15°C</span>
          
          <div className="absolute right-5 bottom-14 w-4 h-4 bg-white border-4 border-[#ff7b72] rounded-full shadow-md z-20"></div>
        </div>

        <span className="absolute right-24 lg:right-32 text-[#ff7b72] font-semibold text-sm">25°C</span>
        <button 
          onClick={() => setTargetTemp(p => p + 1)}
          className="absolute right-8 lg:right-16 w-12 h-12 bg-[#7048e8] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#7048e8]/30 hover:bg-[#6038d8] transition"
        >
          <Plus size={20} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
