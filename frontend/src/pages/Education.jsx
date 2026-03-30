import React from 'react';
import { ShieldCheck, Moon, Dumbbell, Apple, Ban, Activity, Stethoscope, AlertTriangle, Info } from 'lucide-react';
import FullScreenOverlay from '../components/FullScreenOverlay';
import TipRow from '../components/TipRow';

export default function Education({ navigateTo, t }) {
  return (
    <FullScreenOverlay onClose={() => navigateTo('dashboard', 'Going to Home...')} title={t.education}>
      <div className="p-4 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
          <div className="bg-emerald-500 p-3 flex items-center space-x-2 text-white">
            <ShieldCheck size={20} />
            <h4 className="font-bold">Essential Do's</h4>
          </div>
          <div className="p-4 space-y-4">
            <TipRow icon={<Moon className="text-emerald-500"/>} title="Sleep Position" desc="Sleep on your left side to improve blood flow to the heart and baby." />
            <TipRow icon={<Dumbbell className="text-emerald-500"/>} title="Stay Active" desc="Gentle walking or prenatal yoga for 30 mins daily is highly recommended." />
            <TipRow icon={<Apple className="text-emerald-500"/>} title="Eat Well" desc="Increase intake of iron, calcium, and folic acid rich foods." />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden">
          <div className="bg-rose-500 p-3 flex items-center space-x-2 text-white">
            <Ban size={20} />
            <h4 className="font-bold">Important Don'ts</h4>
          </div>
          <div className="p-4 space-y-4">
            <TipRow icon={<Activity className="text-rose-500"/>} title="Heaving Lifting" desc="Avoid lifting objects heavier than 5kg to prevent strain." />
            <TipRow icon={<Stethoscope className="text-rose-500"/>} title="Skip Meds" desc="Never skip your prenatal vitamins or prescribed checkups." />
            <TipRow icon={<AlertTriangle className="text-rose-500"/>} title="Raw Foods" desc="Avoid unpasteurized milk or raw eggs/meat to prevent infection." />
          </div>
        </div>

        <div className="bg-indigo-50 p-4 rounded-xl flex items-start space-x-3 border border-indigo-100">
          <Info className="text-indigo-500 shrink-0" size={20} />
          <p className="text-xs text-indigo-700 font-medium">Always consult your doctor before starting any new exercise or diet during pregnancy.</p>
        </div>
      </div>
    </FullScreenOverlay>
  );
}
