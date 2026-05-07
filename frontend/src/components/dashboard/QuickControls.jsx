import { useState } from "react";
import { Home, Moon, Sun, Zap } from "lucide-react";
import apiClient from "../../services/api";

const SCENES = [
  {
    id: 'home',
    label: 'Ở nhà',
    icon: Home,
    color: '#7048e8',
    lightColor: '#ede9fe',
    description: 'Bật đèn, tắt quạt',
    action: async (dbDevices) => {
      const commands = [];
      const actuators = dbDevices.filter(d => d.type === 'Actuator');
      actuators.forEach(d => {
        const key = d.feed_key?.toLowerCase() || '';
        const name = d.name?.toLowerCase() || '';
        if (key.includes('led') || key.includes('light') || name.includes('đèn')) {
          commands.push(apiClient.post('/devices/control', { id: d._id, feedKey: d.feed_key, trangThai: 'ON' }));
        } else if (key.includes('fan') || name.includes('quạt')) {
          commands.push(apiClient.post('/devices/control', { id: d._id, feedKey: d.feed_key, trangThai: 'OFF' }));
        }
      });
      await Promise.allSettled(commands);
    }
  },
  {
    id: 'sleep',
    label: 'Đi ngủ',
    icon: Moon,
    color: '#0ea5e9',
    lightColor: '#e0f2fe',
    description: 'Tắt tất cả thiết bị',
    action: async (dbDevices) => {
      const commands = dbDevices
        .filter(d => d.type === 'Actuator')
        .map(d => apiClient.post('/devices/control', { id: d._id, feedKey: d.feed_key, trangThai: 'OFF' }));
      await Promise.allSettled(commands);
    }
  },
  {
    id: 'daytime',
    label: 'Ban ngày',
    icon: Sun,
    color: '#f59e0b',
    lightColor: '#fef3c7',
    description: 'Tắt đèn, bật quạt',
    action: async (dbDevices) => {
      const commands = [];
      const actuators = dbDevices.filter(d => d.type === 'Actuator');
      actuators.forEach(d => {
        const key = d.feed_key?.toLowerCase() || '';
        const name = d.name?.toLowerCase() || '';
        if (key.includes('led') || key.includes('light') || name.includes('đèn')) {
          commands.push(apiClient.post('/devices/control', { id: d._id, feedKey: d.feed_key, trangThai: 'OFF' }));
        } else if (key.includes('fan') || name.includes('quạt')) {
          commands.push(apiClient.post('/devices/control', { id: d._id, feedKey: d.feed_key, trangThai: 'ON' }));
        }
      });
      await Promise.allSettled(commands);
    }
  },
  {
    id: 'eco',
    label: 'Tiết kiệm',
    icon: Zap,
    color: '#10b981',
    lightColor: '#d1fae5',
    description: 'Tắt đèn, tắt quạt',
    action: async (dbDevices) => {
      const commands = [];
      const actuators = dbDevices.filter(d => d.type === 'Actuator');
      actuators.forEach(d => {
        const key = d.feed_key?.toLowerCase() || '';
        const name = d.name?.toLowerCase() || '';
        if (key.includes('led') || key.includes('light') || key.includes('fan') || name.includes('đèn') || name.includes('quạt')) {
          commands.push(apiClient.post('/devices/control', { id: d._id, feedKey: d.feed_key, trangThai: 'OFF' }));
        }
      });
      await Promise.allSettled(commands);
    }
  },
];

export default function QuickControls({ dbDevices = [] }) {
  const [activeScene, setActiveScene] = useState(null);
  const [loading, setLoading] = useState(null);

  const handleScene = async (scene) => {
    if (loading) return;
    setLoading(scene.id);
    try {
      await scene.action(dbDevices);
      setActiveScene(scene.id);
    } catch (err) {
      console.error("Lỗi khi áp dụng scene:", err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Smart Scenes</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {SCENES.map(scene => {
          const isActive = activeScene === scene.id;
          const isLoading = loading === scene.id;
          const Icon = scene.icon;

          return (
            <button
              key={scene.id}
              onClick={() => handleScene(scene)}
              disabled={!!loading}
              className={`group cursor-pointer p-5 rounded-3xl transition-all duration-300 text-left relative overflow-hidden ${
                isActive
                  ? 'shadow-xl scale-105 z-10'
                  : 'bg-white text-slate-400 hover:shadow-md hover:scale-[1.02]'
              } ${loading && !isLoading ? 'opacity-60' : ''}`}
              style={isActive ? { backgroundColor: scene.color } : {}}
            >
              {/* Subtle bg for inactive */}
              {!isActive && (
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"
                  style={{ backgroundColor: scene.lightColor }}
                />
              )}

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center"
                    style={{
                      backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : scene.lightColor,
                    }}
                  >
                    <Icon
                      size={20}
                      style={{ color: isActive ? 'white' : scene.color }}
                      className={isLoading ? 'animate-pulse' : ''}
                    />
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full transition-all ${
                      isActive ? 'bg-white' : 'bg-slate-200'
                    }`}
                  />
                </div>

                <p className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-800'}`}>
                  {scene.label}
                </p>
                <p className={`text-xs mt-0.5 ${isActive ? 'text-white/70' : 'text-slate-400'}`}>
                  {isLoading ? 'Đang áp dụng...' : scene.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
