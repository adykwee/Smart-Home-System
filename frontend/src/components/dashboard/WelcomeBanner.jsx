import { useEffect, useState } from "react";
import { ThermometerSun, Cloud, CloudRain, Sun, CloudSnow, CloudLightning, Wind, Droplets, Loader2 } from "lucide-react";

const CITY = "Ho Chi Minh City";
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || ""; 
const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric&lang=vi`;

function WeatherIcon({ code, size = 24 }) {
  if (!code) return <ThermometerSun size={size} />;
  if (code.startsWith('01')) return <Sun size={size} className="text-yellow-500" />;
  if (code.startsWith('02') || code.startsWith('03') || code.startsWith('04')) return <Cloud size={size} className="text-slate-400" />;
  if (code.startsWith('09') || code.startsWith('10')) return <CloudRain size={size} className="text-blue-400" />;
  if (code.startsWith('11')) return <CloudLightning size={size} className="text-amber-500" />;
  if (code.startsWith('13')) return <CloudSnow size={size} className="text-sky-300" />;
  return <Wind size={size} className="text-slate-400" />;
}

export default function WelcomeBanner({ username = "User" }) {
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    if (!API_KEY) {
      setWeather({
        temp: 32,
        feels_like: 35,
        humidity: 70,
        description: "nhiều mây",
        icon: "03d",
        wind: 10,
      });
      setWeatherLoading(false);
      return;
    }
    fetch(WEATHER_URL)
      .then(res => res.json())
      .then(data => {
        if (data.cod === 200) {
          setWeather({
            temp: Math.round(data.main.temp),
            feels_like: Math.round(data.main.feels_like),
            humidity: data.main.humidity,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            wind: Math.round(data.wind.speed * 3.6),
          });
        }
      })
      .catch(() => {})
      .finally(() => setWeatherLoading(false));
  }, []);

  const hour = new Date().getHours();
  const isDaytime = hour >= 6 && hour < 18;
  const gradient = isDaytime
    ? "from-orange-100 to-yellow-50"
    : "from-indigo-100 to-slate-50";
  const textColor = isDaytime ? "text-amber-900" : "text-indigo-900";
  const subTextColor = isDaytime ? "text-amber-800/70" : "text-indigo-800/70";

  return (
    <div className={`relative w-full rounded-3xl bg-gradient-to-r ${gradient} p-8 overflow-hidden shadow-sm`}>
      <div className="relative z-10 w-2/3">
        <h1 className={`text-3xl font-bold ${textColor} mb-2 font-serif capitalize`}>
          {isDaytime ? 'Good Day,' : 'Good Evening,'} {username}!
        </h1>
        <p className={`${subTextColor} text-sm mb-5 max-w-sm`}>
          Chào mừng bạn về nhà. Hệ thống đang hoạt động ổn định.
        </p>

        <div className="flex flex-col gap-2">
          {weatherLoading ? (
            <div className={`flex items-center gap-2 ${subTextColor}`}>
              <Loader2 size={16} className="animate-spin" />
              <span className="text-xs">Đang lấy thời tiết...</span>
            </div>
          ) : weather ? (
            <>
              <div className={`flex items-center gap-2 ${textColor} font-semibold`}>
                <WeatherIcon code={weather.icon} size={18} />
                <span>{weather.temp}°C - {weather.description} tại {CITY}</span>
              </div>
              <div className={`flex items-center gap-4 ${subTextColor} text-sm`}>
                <div className="flex items-center gap-1">
                  <Droplets size={14} />
                  <span>Độ ẩm: {weather.humidity}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wind size={14} />
                  <span>Gió: {weather.wind} km/h</span>
                </div>
              </div>
              <p className={`${subTextColor} text-xs`}>
                Nhiệt độ thực tế: {weather.feels_like}°C
              </p>
            </>
          ) : (
            <>
              <div className={`flex items-center gap-2 ${textColor} font-semibold`}>
                <ThermometerSun size={18} />
                <span>Không thể tải dữ liệu thời tiết thời gian thực</span>
              </div>
              <p className={`${subTextColor} text-xs`}>
                Đang hiển thị dữ liệu thời tiết mặc định.
              </p>
            </>
          )}
        </div>
      </div>

      <div className="absolute right-0 bottom-0 h-full w-1/3 flex items-end justify-end pointer-events-none opacity-90">
        <img
          src="https://api.dicebear.com/7.x/shapes/svg?seed=weather&backgroundColor=transparent"
          className="h-[120%] object-cover transform translate-x-10 translate-y-4"
          alt="illustration"
        />
      </div>
    </div>
  );
}
