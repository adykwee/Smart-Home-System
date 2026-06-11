import { Wind, Minus, Plus } from "lucide-react";

// Tốc độ quạt: 0 = Tắt, 1-3 = Thấp, 4-6 = Trung bình, 7-10 = Cao
const SPEED_LEVELS = [
  { max: 0, label: 'Tắt', color: '#94a3b8', gradient: ['#94a3b8', '#94a3b8'] },
  { max: 3, label: 'Thấp', color: '#06b6d4', gradient: ['#06b6d4', '#0ea5e9'] },
  { max: 6, label: 'Trung bình', color: '#7048e8', gradient: ['#7048e8', '#a855f7'] },
  { max: 10, label: 'Cao', color: '#f59e0b', gradient: ['#f59e0b', '#ef4444'] },
];

function getSpeedLevel(speed) {
  if (speed === 0) return SPEED_LEVELS[0];
  if (speed <= 3) return SPEED_LEVELS[1];
  if (speed <= 6) return SPEED_LEVELS[2];
  return SPEED_LEVELS[3];
}

export default function FanSpeedDial({ 
  fanSpeed, 
  setFanSpeed, 
  deviceName, 
  fanDevices, 
  activeFanId, 
  onSelectFan 
}) {
  const level = getSpeedLevel(fanSpeed);
  const isOn = fanSpeed > 0;
  const MAX_SPEED = 10;

  // Tính toán vòng cung SVG
  // Vòng cung từ -225deg đến 45deg (tổng 270deg)
  const circumference = 2 * Math.PI * 45; // r=45
  // strokeDasharray cho vòng cung 270deg = 270/360 * circumference = 0.75 * ~282.7 = 212
  const trackLength = circumference * 0.75;
  const progressLength = (fanSpeed / MAX_SPEED) * trackLength;

  // Tick marks
  const ticks = Array.from({ length: 11 }, (_, i) => {
    // Từ -225deg đến 45deg (270 độ tổng cộng)
    const angle = -225 + (i / MAX_SPEED) * 270;
    const isActive = i <= fanSpeed;
    return { angle, isActive, i };
  });

  return (
    <div className="bg-white rounded-3xl p-8 flex flex-col shadow-sm relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center gap-2 flex-1">
          <Wind
            size={20}
            className="transition-all duration-500 shrink-0"
            style={{
              color: level.color,
              animation: isOn ? `spin ${Math.max(0.5, 2 - fanSpeed * 0.15)}s linear infinite` : 'none',
            }}
          />
          <div className="flex-1 min-w-0 pr-4">
            <span className="font-bold text-slate-800 block leading-none text-xs text-slate-400 mb-1">Fan Speed</span>
            {fanDevices && fanDevices.length > 1 ? (
              <select
                value={activeFanId || ""}
                onChange={(e) => onSelectFan(e.target.value)}
                className="bg-slate-50 border-none font-bold text-slate-700 text-sm py-1 px-2 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-full max-w-[180px] transition-all cursor-pointer"
              >
                {fanDevices.map(d => (
                  <option key={d._id || d.id} value={d._id || d.id}>
                    {d.name} ({d.room || 'Không rõ phòng'})
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-sm font-bold text-slate-800 block truncate">
                {deviceName || "Quạt chưa kết nối"}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold" style={{ color: level.color }}>
            {level.label}
          </span>
          <div
            className="w-10 h-6 rounded-full p-1 flex items-center cursor-pointer transition-colors duration-300"
            style={{ backgroundColor: isOn ? level.color : '#e2e8f0' }}
            onClick={() => setFanSpeed(isOn ? 0 : 5)}
          >
            <div
              className="w-4 h-4 rounded-full bg-white shadow transition-transform duration-300"
              style={{ transform: isOn ? 'translateX(16px)' : 'translateX(0)' }}
            />
          </div>
        </div>
      </div>

      {/* Dial */}
      <div className="flex-1 flex items-center justify-center relative min-h-[260px]">
        {/* Decrease button */}
        <button
          onClick={() => setFanSpeed(Math.max(0, fanSpeed - 1))}
          className="absolute left-8 lg:left-16 w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition active:scale-95"
        >
          <Minus size={20} strokeWidth={3} />
        </button>
        <span className="absolute left-24 lg:left-32 text-slate-400 font-semibold text-sm">0</span>

        {/* SVG Dial */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Tick marks */}
          <svg className="absolute w-full h-full" viewBox="0 0 100 100">
            {ticks.map(({ angle, isActive, i }) => (
              <line
                key={i}
                x1="50" y1="5" x2="50" y2="10"
                transform={`rotate(${angle} 50 50)`}
                stroke={isActive ? level.color : '#e2e8f0'}
                strokeWidth={isActive ? "2" : "1.5"}
                strokeLinecap="round"
                style={{ transition: 'stroke 0.3s ease' }}
              />
            ))}
          </svg>

          {/* Track & Progress ring */}
          <svg className="absolute w-52 h-52" viewBox="0 0 100 100" style={{ transform: 'rotate(135deg)' }}>
            {/* Track */}
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="8"
              strokeDasharray={`${trackLength} ${circumference}`}
              strokeLinecap="round"
            />
            {/* Progress */}
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="url(#fanGrad)"
              strokeWidth="8"
              strokeDasharray={`${progressLength} ${circumference}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.4s ease' }}
            />
            <defs>
              <linearGradient id="fanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={level.gradient[0]} />
                <stop offset="100%" stopColor={level.gradient[1]} />
              </linearGradient>
            </defs>
          </svg>

          {/* Center display */}
          <div className="w-40 h-40 bg-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex flex-col items-center justify-center z-10 border border-slate-50">
            <Wind
              size={28}
              className="mb-1 transition-all duration-300"
              style={{
                color: isOn ? level.color : '#cbd5e1',
                animation: isOn ? `spin ${Math.max(0.4, 2 - fanSpeed * 0.15)}s linear infinite` : 'none',
              }}
            />
            <span className="text-4xl font-bold text-slate-800">{fanSpeed}</span>
            <span className="text-xs text-slate-400 mt-0.5">/ {MAX_SPEED}</span>
          </div>
        </div>

        <span className="absolute right-24 lg:right-32 font-semibold text-sm" style={{ color: level.color }}>
          {MAX_SPEED}
        </span>
        <button
          onClick={() => setFanSpeed(Math.min(MAX_SPEED, fanSpeed + 1))}
          className="absolute right-8 lg:right-16 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition active:scale-95"
          style={{ backgroundColor: level.color, boxShadow: `0 8px 20px ${level.color}40` }}
        >
          <Plus size={20} strokeWidth={3} />
        </button>
      </div>

      {/* Speed label pills */}
      <div className="flex justify-between mt-4 px-2">
        {SPEED_LEVELS.map(lvl => (
          <div
            key={lvl.label}
            className="flex flex-col items-center gap-1 cursor-pointer"
            onClick={() => setFanSpeed(lvl.max)}
          >
            <div
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: level.label === lvl.label ? lvl.color : '#e2e8f0',
                transform: level.label === lvl.label ? 'scale(1.5)' : 'scale(1)',
              }}
            />
            <span className="text-[10px] font-bold text-slate-400">{lvl.label}</span>
          </div>
        ))}
      </div>

      {/* CSS animation keyframes via style tag */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
