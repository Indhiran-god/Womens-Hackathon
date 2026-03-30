import React, { useState } from 'react';
import { Apple, Plus, Trash2 } from 'lucide-react';
import FullScreenOverlay from '../components/FullScreenOverlay';

export default function Nutrition({ 
  navigateTo, 
  t, 
  nutrientValues, 
  nutritionCategory, 
  setNutritionCategory, 
  addNutrient, 
  intakeLog, 
  removeIntake 
}) {
  const [customFood, setCustomFood] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeFood = () => {
    if (!customFood.trim()) return;
    setIsAnalyzing(true);
    
    // Simulate an AI parsing layer for instant offline capability during presentation
    setTimeout(() => {
      let type = 'protein'; // default
      let amount = Math.floor(Math.random() * 8) + 5; // 5 to 12%
      
      const text = customFood.toLowerCase();
      if (text.includes('apple') || text.includes('date') || text.includes('spinach') || text.includes('pomegranate') || text.includes('iron') || text.includes('மாதுளை') || text.includes('பேரிச்சை') || text.includes('ஆப்பிள்')) {
        type = 'iron';
        amount += 5;
      } else if (text.includes('milk') || text.includes('egg') || text.includes('cheese') || text.includes('paneer') || text.includes('ragi') || text.includes('பால்') || text.includes('முட்டை')) {
        type = 'calcium';
        amount += 10;
      } else if (text.includes('meat') || text.includes('chicken') || text.includes('dal') || text.includes('fish') || text.includes('மீன்') || text.includes('கறி') || text.includes('பருப்பு')) {
        type = 'protein';
        amount += 8;
      }

      addNutrient(type, amount, customFood);
      setCustomFood('');
      setIsAnalyzing(false);
    }, 1200); // UI illusion of connecting to AI
  };

  return (
    <FullScreenOverlay onClose={() => navigateTo('dashboard', 'Going to Home...')} title={t.nutrition}>
      <div className="p-5 space-y-6">
        <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-[24px]">
          <h3 className="font-bold text-emerald-800 text-lg flex items-center">
            <Apple className="mr-2 text-emerald-500" size={20} /> இன்றைய ஊட்டச்சத்து
          </h3>
          <p className="text-xs text-emerald-600 font-medium mt-1">Daily Nutrition Value Tracker</p>
          
          <div className="flex justify-between mt-5">
            <div className="text-center group">
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest group-hover:text-rose-400 transition-colors">Iron</p>
              <p className="text-lg font-black text-rose-500 mt-0.5">{nutrientValues.iron}%</p>
            </div>
            <div className="text-center group">
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest group-hover:text-blue-400 transition-colors">Calcium</p>
              <p className="text-lg font-black text-blue-500 mt-0.5">{nutrientValues.calcium}%</p>
            </div>
            <div className="text-center group">
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest group-hover:text-emerald-400 transition-colors">Protein</p>
              <p className="text-lg font-black text-emerald-500 mt-0.5">{nutrientValues.protein}%</p>
            </div>
          </div>
        </div>

        {/* SMART AI FOOD ANALYZER */}
        <div className="bg-white border border-indigo-100 p-5 rounded-3xl shadow-sm mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="relative z-10">
            <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-3 flex items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping mr-2"></span> AI Food Scanner
            </h4>
            <div className="flex bg-slate-50 rounded-2xl border border-slate-100 p-1.5 focus-within:ring-2 focus-within:ring-indigo-200 transition-all">
              <input 
                type="text" 
                value={customFood}
                onChange={(e) => setCustomFood(e.target.value)}
                placeholder="What did you eat? (e.g. 2 Apples)"
                className="flex-1 w-full bg-transparent px-3 py-2 text-sm font-semibold outline-none placeholder:font-normal placeholder:text-slate-400"
                onKeyDown={(e) => e.key === 'Enter' && analyzeFood()}
              />
              <button 
                onClick={analyzeFood}
                disabled={!customFood.trim() || isAnalyzing}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 disabled:scale-100 active:scale-95 flex items-center justify-center min-w-[80px]"
              >
                {isAnalyzing ? (
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                  </div>
                ) : "Add"}
              </button>
            </div>
          </div>
        </div>

        {/* CATEGORY TABS */}
        <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
          {['all', 'iron', 'calcium', 'protein'].map(cat => (
            <button 
              key={cat}
              onClick={() => setNutritionCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${nutritionCategory === cat ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <h4 className="font-black text-slate-400 text-[10px] uppercase tracking-widest px-1">Healthy Food Ideas</h4>
          
          <div className="space-y-3">
            {[
              { name: "முருங்கை கீரை", en: "Drumstick Leaves", icon: "🌿", stats: "Iron 28mg • Vit C", type: 'iron', amount: 8 },
              { name: "கொள்ளு", en: "Horse Gram", icon: "🫘", stats: "Iron 7mg • Protein 22g", type: 'protein', amount: 12 },
              { name: "ராகி கஞ்சி", en: "Ragi Porridge", icon: "🌾", stats: "Calcium 344mg • Iron 3.9mg", type: 'calcium', amount: 15 },
              { name: "சோழி மீன்", en: "Anchovies", icon: "🐟", stats: "Protein 17g • Omega-3", type: 'protein', amount: 10 },
              { name: "பேரிச்சை", en: "Dates", icon: "🌴", stats: "High Iron • Energy", type: 'iron', amount: 5 },
              { name: "மாதுளை", en: "Pomegranate", icon: "🍎", stats: "Blood Purifier • Iron", type: 'iron', amount: 6 },
            ].filter(item => nutritionCategory === 'all' || item.type === nutritionCategory).map((item, id) => (
              <div key={id} onClick={() => addNutrient(item.type, item.amount, item.name)} className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center justify-between shadow-sm active:scale-[0.98] transition-all cursor-pointer hover:border-indigo-100 hover:shadow-md group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">{item.name}</h5>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide leading-none my-1">{item.en}</p>
                    <p className={`text-[10px] font-black uppercase tracking-tight ${item.type === 'iron' ? 'text-rose-500' : item.type === 'calcium' ? 'text-blue-500' : 'text-emerald-500'}`}>
                      {item.stats}
                    </p>
                  </div>
                </div>
                <div className="bg-emerald-50 text-emerald-600 w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Plus size={18} />
                </div>
              </div>
            ))}
          </div>

          {/* NEW: INTAKE LOG WITH DELETE OPTION */}
          {intakeLog.length > 0 && (
            <div className="pt-6 pb-24">
              <h4 className="font-black text-rose-400 text-[10px] uppercase tracking-widest px-1 mb-4">Today's Intake Log</h4>
              <div className="space-y-2">
                {intakeLog.map(log => (
                  <div key={log.id} className="bg-rose-50/30 border border-rose-100/50 p-3 rounded-xl flex items-center justify-between animate-in slide-in-from-left-4 duration-300">
                    <div className="flex items-center space-x-3">
                      <span className={`w-1.5 h-1.5 rounded-full ${log.type === 'iron' ? 'bg-rose-500' : log.type === 'calcium' ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
                      <span className="text-xs font-bold text-slate-700">{log.name}</span>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">+{log.amount}% {log.type}</span>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); removeIntake(log.id, log.type, log.amount, log.name); }} className="p-1.5 text-rose-300 hover:text-rose-600 hover:bg-rose-100/50 rounded-lg transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </FullScreenOverlay>
  );
}
