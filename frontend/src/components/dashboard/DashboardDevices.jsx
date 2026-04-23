import { ChevronDown, ChevronRight, Refrigerator, Router, Speaker, LampDesk, Thermometer, Droplets, Sun, Zap } from "lucide-react";

export default function DashboardDevices({ devicesState, toggleDevice, sensorValues = {} }) {
  
  // Hàm phụ trợ để xác định loại cảm biến dựa trên tên Feed
  const getSensorConfig = (key) => {
    const k = key.toLowerCase();
    if (k.includes('temp') || k.includes('nhiet')) {
      return { name: 'Nhiệt độ', icon: Thermometer, unit: '°C', bg: 'bg-[#ffc033]' };
    }
    if (k.includes('humid') || k.includes('doam')) {
      return { name: 'Độ ẩm', icon: Droplets, unit: '%', bg: 'bg-[#7048e8]' };
    }
    if (k.includes('light') || k.includes('anhsang')) {
      return { name: 'Ánh sáng', icon: Sun, unit: 'Lux', bg: 'bg-[#33ccff]' };
    }
    return null;
  };

  // Tạo danh sách thiết bị động
  const dynamicDevices = [];

  // 1. Thêm các cảm biến dựa trên dữ liệu thực tế nhận được
  Object.keys(sensorValues).forEach(key => {
    const config = getSensorConfig(key);
    if (config) {
      // Chỉ thêm nếu loại này chưa tồn tại trong list (để tránh lặp nếu có nhiều feed cùng loại)
      if (!dynamicDevices.find(d => d.name === config.name)) {
        dynamicDevices.push({
          id: key,
          name: config.name,
          icon: config.icon,
          bg: config.bg,
          type: 'sensor',
          unit: config.unit,
          feed: key
        });
      }
    }
  });

  // 2. Thêm các thiết bị điều khiển cơ bản (Actuators)
  const actuators = [
    { id: 'Fan', name: 'Quạt', icon: Zap, bg: 'bg-[#ff8f66]', type: 'actuator' },
    { id: 'Lamps', name: 'Đèn chiếu sáng', icon: LampDesk, bg: 'bg-[#4dabf7]', type: 'actuator' },
  ];

  const allDevices = [...dynamicDevices, ...actuators];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800">Thiết bị & Cảm biến</h3>
        <div className="flex items-center gap-2">
          <button className="text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm">
            TẤT CẢ <ChevronDown size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {allDevices.map(dev => (
          <div key={dev.id} className={`${dev.bg} rounded-3xl p-5 flex flex-col relative overflow-hidden group h-32 transition-all hover:scale-[1.02] cursor-default`}>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full"></div>
            <div className="flex justify-between items-start mb-4 z-10">
              <dev.icon size={24} className="text-white" strokeWidth={1.5} />
              
              {dev.type === 'actuator' ? (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-white/90">{devicesState[dev.id] ? 'ON' : 'OFF'}</span>
                  <div 
                    onClick={() => toggleDevice(dev.id)}
                    className={`w-7 h-4 rounded-full p-0.5 flex items-center cursor-pointer transition-colors ${devicesState[dev.id] ? 'bg-white/30' : 'bg-black/10'}`}
                  >
                    <div className={`w-3 h-3 rounded-full bg-white transition-transform ${devicesState[dev.id] ? 'translate-x-3' : ''}`}></div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/20 px-2 py-1 rounded-lg text-[10px] font-bold text-white flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  LIVE
                </div>
              )}
            </div>
            
            <div className="mt-auto z-10">
              <p className="text-[10px] text-white/70 font-bold uppercase tracking-wider">
                {dev.type === 'sensor' ? 'Cảm biến' : 'Thiết bị'}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-white truncate max-w-[80px]">{dev.name}</span>
                {dev.type === 'sensor' && (
                  <span className="text-lg font-black text-white ml-auto">
                    {sensorValues[dev.feed] || '--'}<span className="text-xs font-bold ml-0.5">{dev.unit}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
