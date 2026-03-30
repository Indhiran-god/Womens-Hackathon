import React, { useState } from 'react';
import { Trash2, CheckCircle2 } from 'lucide-react';

export default function ReminderCard({ icon, title, time, bg, color, onDelete }) {
  const [completed, setCompleted] = useState(false);
  
  const handleDone = () => {
    if(!completed) setCompleted(true);
  }

  return (
    <div 
      onClick={handleDone}
      className={`relative bg-white p-4 rounded-2xl border transition-all cursor-pointer group active:scale-[0.98] ${completed ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200'}`}
    >
      <div className={`flex items-center space-x-4 ${completed ? 'opacity-50 blur-[0.5px]' : ''}`}>
        <div className={`${bg} ${color} w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 border border-slate-100`}>
          {icon}
        </div>
        <div className="flex-1">
          <h4 className={`font-bold transition-all text-sm ${completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{title}</h4>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">{time}</p>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all z-10"
          title="Delete Reminder"
        >
          <Trash2 size={20}/>
        </button>
      </div>
      
      {/* Completion Stamp */}
      {completed && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-in zoom-in-75 duration-300">
          <div className="bg-emerald-500/90 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg flex items-center">
            <CheckCircle2 size={12} className="mr-1" /> Completed
          </div>
        </div>
      )}
    </div>
  )
}
