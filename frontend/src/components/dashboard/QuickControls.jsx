import { Refrigerator, Zap, Wind, Lightbulb } from "lucide-react";

export default function QuickControls({ activeDevice, setActiveDevice }) {
  const devices = [
    { id: 'Refrigerator', icon: Refrigerator, isOn: true },
    { id: 'Temperature', icon: Zap, isOn: true },
    { id: 'Air Conditioner', icon: Wind, isOn: false },
    { id: 'Lights', icon: Lightbulb, isOn: false },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {devices.map(device => {
        const isSelected = activeDevice === device.id;
        const Icon = device.icon;
        return (
          <div 
            key={device.id}
            onClick={() => setActiveDevice(device.id)}
            className={`cursor-pointer p-5 rounded-3xl transition-all duration-300 relative ${
              isSelected 
                ? 'bg-[#7048e8] text-white shadow-xl shadow-[#7048e8]/30 scale-105 z-10' 
                : 'bg-white text-slate-400 hover:shadow-md'
            }`}
          >
            <div className="flex justify-between items-start mb-6">
              <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                {device.isOn ? 'ON' : 'OFF'}
              </span>
              <div className={`w-8 h-4 rounded-full p-0.5 flex items-center transition-colors ${isSelected ? 'bg-white/30' : 'bg-slate-100'}`}>
                <div className={`w-3 h-3 rounded-full bg-white transition-transform ${device.isOn ? 'translate-x-4' : ''}`}></div>
              </div>
            </div>
            <Icon size={28} strokeWidth={1.5} className={`mb-3 ${isSelected ? 'text-white' : 'text-[#7048e8]'}`} />
            <p className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-500'}`}>{device.id}</p>
          </div>
        )
      })}
    </div>
  );
}
