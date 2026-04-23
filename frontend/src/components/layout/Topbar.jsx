import { NavLink } from "react-router-dom";
import { Search, Settings, Bell, ChevronDown } from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-24 flex items-center justify-between px-10 pt-4 z-10">
      <div className="relative w-[400px]">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-4 py-3 bg-white border-none rounded-2xl text-sm placeholder-slate-400 focus:ring-2 focus:ring-[#7048e8]/20 focus:outline-none shadow-sm"
          placeholder="Search"
        />
      </div>

      <div className="flex items-center gap-6">
        <NavLink to="/settings" className="p-2 text-slate-600 hover:text-[#7048e8] hover:bg-white rounded-full transition cursor-pointer">
          <Settings size={22} strokeWidth={2} />
        </NavLink>
        <button className="relative p-2 text-slate-600 hover:text-[#7048e8] hover:bg-white rounded-full transition">
          <Bell size={22} strokeWidth={2} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 border-2 border-[#f4f5f9] rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 ml-2 cursor-pointer bg-white py-1.5 px-2.5 pr-4 rounded-full shadow-sm hover:shadow transition">
          <img 
            src="https://api.dicebear.com/7.x/notionists/svg?seed=Scarlett&backgroundColor=e0e7ff" 
            alt="Profile" 
            className="w-10 h-10 rounded-full border-2 border-indigo-100"
          />
          <span className="text-sm font-bold text-slate-800">Scarlett</span>
          <ChevronDown size={16} className="text-slate-400 ml-1" />
        </div>
      </div>
    </header>
  );
}
