import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function FullScreenOverlay({ children, onClose, title, bgColor = 'bg-white' }) {
  return (
    <div className={`absolute inset-0 ${bgColor} z-20 flex flex-col animate-in slide-in-from-right-8 duration-300`}>
      <div className={`p-4 flex items-center justify-between shadow-sm ${bgColor === 'bg-slate-900' ? 'bg-slate-900 text-white border-b border-slate-800' : 'bg-white text-gray-800 border-b border-gray-100'}`}>
        <div className="flex items-center">
          <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-gray-100/20 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="font-bold ml-2 text-lg">{title}</h2>
        </div>
        <button onClick={onClose} className="text-[10px] uppercase font-black tracking-widest text-slate-400 hover:text-rose-500 transition-colors px-3 py-1.5 rounded-xl border border-slate-100">
          Close X
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
