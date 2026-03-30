import React, { useState, useEffect } from 'react';
import { Apple, AlertTriangle, CheckCircle2, Download, Info, ChevronDown, ChevronRight } from 'lucide-react';
import FullScreenOverlay from '../components/FullScreenOverlay';

const FRUITS_DATA = {
    1: {
        safe: ['Banana', 'Apple', 'Orange'],
        benefits: ['Nausea control', 'Folate for brain', 'Vitamin C immunity'],
        avoid: ['Raw Papaya', 'Pineapple'],
        reasons: ['Contractions risk', 'Bromelain enzyme']
    },
    2: {
        safe: ['Pomegranate', 'Guava', 'Custard Apple'],
        benefits: ['Iron boost', 'Vitamin C', 'Calcium growth'],
        avoid: ['Grapes excess', 'Unripe Mango'],
        reasons: ['Heat body', 'Digestive issues']
    },
    3: {
        safe: ['Berries', 'Watermelon', 'Dates'],
        benefits: ['Antioxidants', 'Hydration', 'Energy'],
        avoid: ['Papaya skin', 'Overripe fruits'],
        reasons: ['Toxins', 'Infection risk']
    },
    4: {
        safe: ['Mango (ripe)', 'Muskmelon', 'Kiwi'],
        benefits: ['Vitamin A eyes', 'Digestion', 'Fiber'],
        avoid: ['Citrus excess', 'Dried fruits'],
        reasons: ['Acidity', 'Sugar spike']
    },
    5: {
        safe: ['Pear', 'Chikoo', 'Banana'],
        benefits: ['Digestion', 'Energy', 'Potassium'],
        avoid: ['Pineapple excess', 'Raw fruits'],
        reasons: ['Cervix soft', 'Digestive upset']
    },
    6: {
        safe: ['Apple', 'Pomegranate', 'Orange'],
        benefits: ['Iron', 'Folate', 'Vitamin C'],
        avoid: ['Unwashed fruits', 'Grapes excess'],
        reasons: ['Pesticides', 'Heat']
    },
    7: {
        safe: ['Watermelon', 'Muskmelon', 'Dates'],
        benefits: ['Swelling reduce', 'Hydration', 'Labor strength'],
        avoid: ['Papaya', 'Pineapple'],
        reasons: ['Contractions', 'Early labor']
    },
    8: {
        safe: ['Dates (6-7 daily)', 'Banana', 'Custard Apple'],
        benefits: ['Delivery energy', 'Potassium', 'Calcium'],
        avoid: ['Grapes', 'Citrus'],
        reasons: ['Swelling increase', 'Acidity']
    },
    9: {
        safe: ['Apple', 'Pomegranate', 'Dates'],
        benefits: ['Normal delivery ease', 'Iron', 'Strength'],
        avoid: ['Papaya', 'Pineapple', 'Unripe fruits'],
        reasons: ['Labor trigger', 'Digestive issues']
    }
};

export default function FruitGuide({ navigateTo, t }) {
    const [month, setMonth] = useState(null);
    const data = month ? FRUITS_DATA[month] : null;

    return (
        <FullScreenOverlay onClose={() => navigateTo('dashboard', 'Going to Home...')} title="Fruit Nutrition Guide" bgColor="bg-slate-50">
            <div className="p-4 space-y-6">
                
                {/* Warning Card */}
                <div className="bg-rose-50 border-l-4 border-rose-500 p-5 rounded-2xl shadow-sm">
                    <div className="flex items-center space-x-2 text-rose-600 mb-2">
                        <AlertTriangle size={20} />
                        <h3 className="font-black text-xs uppercase tracking-widest">முக்கிய எச்சரிக்கை</h3>
                    </div>
                    <p className="text-xs font-bold text-slate-700 leading-relaxed">
                        Doctor அவர்களிடம் கலந்தாலோசித்து மட்டுமே பின்பற்றவும்! <br/>
                        <span className="text-slate-400 font-medium">Fruits நன்கு கழுவி, எப்போதுமே Fresh ஆக சாப்பிடவும்.</span>
                    </p>
                </div>

                {/* Month Selector */}
                <div className="bg-white p-6 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">கர்ப்ப கால மாதம் தேர்ந்தெடுக்கவும்</p>
                    <div className="relative w-full">
                        <select 
                            value={month || ""} 
                            onChange={(e) => setMonth(Number(e.target.value))}
                            className="w-full bg-slate-50 border-2 border-emerald-100 rounded-2xl px-6 py-4 text-sm font-black text-slate-800 outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                        >
                            <option value="" disabled>--- Select Month ---</option>
                            {[1,2,3,4,5,6,7,8,9].map(m => (
                                <option key={m} value={m}>{m}{m === 1 ? 'st' : m === 2 ? 'nd' : m === 3 ? 'rd' : 'th'} Month</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none" size={20} />
                    </div>
                </div>

                {!month ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 animate-in fade-in duration-500">
                        <Apple size={64} className="text-emerald-200 animate-pulse" />
                        <p className="text-sm font-black text-slate-800 tracking-tight">சரியான உணவைப் பார்க்க மாதம் தேர்வு செய்யவும்</p>
                    </div>
                ) : (
                    <div className="animate-in slide-in-from-bottom-8 duration-500 space-y-6">
                        {/* Nutrition Cards */}
                        <div className="grid grid-cols-1 gap-4">
                            
                            {/* Safe Fruits */}
                            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 border-t-4 border-t-emerald-500">
                                <div className="flex items-center space-x-3 mb-5">
                                    <div className="bg-emerald-50 p-2 rounded-xl">
                                        <Apple className="text-emerald-500" size={24} />
                                    </div>
                                    <h3 className="font-black text-slate-800 tracking-tight uppercase text-xs">Safe Fruits (சாப்பிடலாம்)</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {data.safe.map((item, i) => (
                                        <div key={i} className="flex items-start space-x-3 bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100">
                                            <div className="mt-1"><CheckCircle2 className="text-emerald-600" size={16} /></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-black text-slate-800">{item}</p>
                                                <p className="text-[10px] font-bold text-emerald-600/70 tracking-wide mt-0.5">{data.benefits[i]}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Avoid Fruits */}
                            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 border-t-4 border-t-rose-500">
                                <div className="flex items-center space-x-3 mb-5">
                                    <div className="bg-rose-50 p-2 rounded-xl">
                                        <AlertTriangle className="text-rose-500" size={24} />
                                    </div>
                                    <h3 className="font-black text-slate-800 tracking-tight uppercase text-xs">Fruits to Avoid</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {data.avoid.map((item, i) => (
                                        <div key={i} className="flex items-start space-x-3 bg-rose-50/50 p-3.5 rounded-2xl border border-rose-100">
                                            <div className="mt-1"><AlertTriangle className="text-rose-600" size={16} /></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-black text-slate-800">{item}</p>
                                                <p className="text-[10px] font-bold text-rose-600/70 tracking-wide mt-0.5">{data.reasons[i]}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Daily Menu Example */}
                        <div className="bg-emerald-600 rounded-[32px] p-8 text-white shadow-xl shadow-emerald-200 relative overflow-hidden print:shadow-none">
                            <div className="relative z-10 space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Info size={20} className="text-emerald-200" />
                                    <h3 className="text-lg font-black tracking-tight">{month}{month === 1 ? 'st' : month === 2 ? 'nd' : month === 3 ? 'rd' : 'th'} Month Sample Menu</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                                        <ul className="text-xs font-bold space-y-3 text-emerald-50">
                                            <li className="flex items-center"><span className="w-2 h-2 bg-white rounded-full mr-3"></span> ☕ Morning: 6 Dates + 1 Banana</li>
                                            <li className="flex items-center"><span className="w-2 h-2 bg-white rounded-full mr-3"></span> 🍊 11 AM: Pomegranate (1 cup)</li>
                                            <li className="flex items-center"><span className="w-2 h-2 bg-white rounded-full mr-3"></span> 🍎 Evening: Apple + Orange</li>
                                            <li className="flex items-center"><span className="w-2 h-2 bg-white rounded-full mr-3"></span> 🌙 Night: Custard Apple (half)</li>
                                        </ul>
                                    </div>
                                    <p className="text-[10px] font-black text-emerald-200 uppercase tracking-widest text-center mt-2 opacity-70">Target: 300g fresh fruits daily</p>
                                </div>
                            </div>
                            <Apple className="absolute -bottom-10 -right-10 text-white/5" size={200} />
                        </div>
                    </div>
                )}

                <button 
                    onClick={() => window.print()} 
                    className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center space-x-3 mb-12 print:hidden"
                >
                    <Download size={18} />
                    <span>Download PDF Chart</span>
                </button>
            </div>
        </FullScreenOverlay>
    );
}
