import { ChevronDown, ChevronRight, Refrigerator, Router, Speaker, LampDesk, Thermometer, Droplets, Sun, Zap, HelpCircle } from "lucide-react";

export default function DashboardDevices({ devicesState, toggleDevice, sensorValues = {}, dbDevices = [] }) {
  
  // Hàm xác định cấu hình (Icon, Màu, Đơn vị) dựa trên loại và tên thiết bị
  const getDeviceConfig = (device) => {
    const type = (device.type || "").toLowerCase();
    const name = (device.name || "").toLowerCase();
    const feed = (device.feed_key || "").toLowerCase();

    // 1. Cấu hình cho Sensor
    if (type === 'sensor' || name.includes('sensor') || feed.includes('sensor')) {
      if (name.includes('temp') || name.includes('nhiet') || feed.includes('temp') || feed.includes('nhiet')) {
        return { icon: Thermometer, unit: '°C', bg: 'bg-[#ffc033]', label: 'Nhiệt độ' };
      }
      if (name.includes('humid') || name.includes('doam') || feed.includes('humid') || feed.includes('doam')) {
        return { icon: Droplets, unit: '%', bg: 'bg-[#7048e8]', label: 'Độ ẩm' };
      }
      if (name.includes('light') || name.includes('anhsang') || feed.includes('light') || feed.includes('anhsang')) {
        return { icon: Sun, unit: 'Lux', bg: 'bg-[#33ccff]', label: 'Ánh sáng' };
      }
      return { icon: Thermometer, unit: '', bg: 'bg-slate-400', label: 'Cảm biến' };
    }

    // 2. Cấu hình cho Actuator (Điều khiển)
    if (name.includes('fan') || name.includes('quat') || type === 'fan') {
      return { icon: Zap, bg: 'bg-[#ff8f66]', label: 'Quạt' };
    }
    if (name.includes('light') || name.includes('den') || name.includes('led') || type === 'light') {
      return { icon: LampDesk, bg: 'bg-[#4dabf7]', label: 'Đèn' };
    }
    if (name.includes('fridge') || name.includes('tu lanh')) {
      return { icon: Refrigerator, bg: 'bg-[#51cf66]', label: 'Tủ lạnh' };
    }
    
    return { icon: Zap, bg: 'bg-slate-500', label: 'Thiết bị' };
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800">Devices</h3>
        <div className="flex items-center gap-2">
          <button className="text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm">
            TẤT CẢ <ChevronDown size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {dbDevices.length === 0 ? (
          <div className="col-span-2 py-10 text-center text-slate-400 italic text-sm bg-white rounded-3xl border border-dashed border-slate-200">
            Chưa có thiết bị nào trong Database.
          </div>
        ) : (
          dbDevices.map(device => {
            const config = getDeviceConfig(device);
            const isSensor = device.type === 'Sensor' || device.feed_key.includes('sensor');
            const deviceId = device._id || device.id;
            const currentVal = isSensor ? (sensorValues[device.feed_key] || device.current_status) : devicesState[deviceId];

            return (
              <div key={deviceId} className={`${config.bg} rounded-3xl p-5 flex flex-col relative overflow-hidden group h-32 transition-all hover:scale-[1.02] cursor-default shadow-sm hover:shadow-md`}>
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full"></div>
                <div className="flex justify-between items-start mb-4 z-10">
                  <config.icon size={24} className="text-white" strokeWidth={1.5} />
                  
                  {!isSensor ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-white/90">{devicesState[deviceId] ? 'ON' : 'OFF'}</span>
                      <div 
                        onClick={() => toggleDevice(deviceId)}
                        className={`w-7 h-4 rounded-full p-0.5 flex items-center cursor-pointer transition-colors ${devicesState[deviceId] ? 'bg-white/30' : 'bg-black/10'}`}
                      >
                        <div className={`w-3 h-3 rounded-full bg-white transition-transform ${devicesState[deviceId] ? 'translate-x-3' : ''}`}></div>
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
                    {config.label}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-white truncate max-w-[80px]">
                      {device.name}
                    </span>
                    {isSensor && (
                      <span className="text-lg font-black text-white ml-auto">
                        {currentVal || '--'}<span className="text-xs font-bold ml-0.5">{config.unit}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
