import { ThermometerSun, CloudRain } from "lucide-react";

<<<<<<< Updated upstream
export default function WelcomeBanner() {
  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-r from-orange-100 to-yellow-50 p-8 overflow-hidden shadow-sm">
      <div className="relative z-10 w-2/3">
        <h1 className="text-3xl font-bold text-amber-900 mb-2 font-serif">Hello, Scarlett!</h1>
=======
export default function WelcomeBanner({ username = "User" }) {
  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-r from-orange-100 to-yellow-50 p-8 overflow-hidden shadow-sm">
      <div className="relative z-10 w-2/3">
        <h1 className="text-3xl font-bold text-amber-900 mb-2 font-serif capitalize">Hello, {username}!</h1>
>>>>>>> Stashed changes
        <p className="text-amber-800/70 text-sm mb-6 max-w-sm">
          Welcome Home! The air quality is good & fresh you can go out today.
        </p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-amber-900 font-semibold">
            <ThermometerSun size={18} />
            <span>+25°C Outdoor temperature</span>
          </div>
          <div className="flex items-center gap-2 text-amber-900 font-semibold">
            <CloudRain size={18} />
            <span>Fuzzy cloudy weather</span>
          </div>
        </div>
      </div>
      <div className="absolute right-0 bottom-0 h-full w-1/2 flex items-end justify-end pointer-events-none opacity-90">
         <img src="https://api.dicebear.com/7.x/shapes/svg?seed=weather&backgroundColor=transparent" className="h-[120%] object-cover transform translate-x-10 translate-y-4" alt="illustration" />
      </div>
    </div>
  );
}
