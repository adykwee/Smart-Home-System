import { ChevronRight } from "lucide-react";

export default function Members({ members }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800">Members</h3>
        <ChevronRight size={18} className="text-slate-400" />
      </div>
      <div className="flex justify-between items-center px-2">
        {members.slice(0, 4).map((member, index) => (
          <div key={member.name} className="flex flex-col items-center gap-1">
            <img 
              src={`https://api.dicebear.com/7.x/notionists/svg?seed=${member.seed}&backgroundColor=${index === 0 ? 'e0e7ff' : 'f1f5f9'}`} 
              alt={member.name} 
              className="w-10 h-10 rounded-full border border-slate-100"
            />
            <span className="text-xs font-bold text-slate-800">{member.name}</span>
            <span className="text-[9px] text-slate-400">{member.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
