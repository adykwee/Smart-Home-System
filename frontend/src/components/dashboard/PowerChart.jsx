import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown } from "lucide-react";

export default function PowerChart({ chartData }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm flex-1 flex flex-col relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800">Power Consumed</h3>
        <button className="text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
          Month <ChevronDown size={14} />
        </button>
      </div>
      
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff8f66] border-2 border-[#ff8f66]/30"></div>
          <span className="text-sm font-bold text-slate-600">Electricity Consumed</span>
        </div>
        <span className="text-sm font-bold text-slate-800">73% Spending</span>
      </div>

      <div className="flex-1 w-full min-h-[150px] -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff8f66" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ff8f66" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(val) => `${val}%`} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#ff8f66" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
