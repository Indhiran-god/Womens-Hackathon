import React from 'react';
import { Home, Award, Search, ShoppingBag, User } from 'lucide-react';

export default function BottomNav({ screen, navigateTo }) {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'schemes', label: 'Schemes', icon: Award },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'shop', label: 'Shop', icon: ShoppingBag },
    { id: 'family', label: 'Profile', icon: User },
  ];

  // Only show on these screens
  const visibleScreens = ['dashboard', 'schemes', 'shop', 'family', 'search'];
  if (!visibleScreens.includes(screen)) return null;

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50">
      <div className="bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 pt-2 pb-[env(safe-area-inset-bottom,8px)]">
        <div className="flex items-center justify-around">
          {tabs.map(tab => {
            const isActive = screen === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'search') return; // search handled inline
                  navigateTo(tab.id, `Loading ${tab.label}...`);
                }}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all active:scale-90 min-w-[56px] ${
                  isActive
                    ? 'text-indigo-600'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-indigo-50' : ''}`}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                <span className={`text-[9px] mt-0.5 font-black uppercase tracking-widest ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {tab.label}
                </span>
                {isActive && (
                  <div className="w-1 h-1 bg-indigo-500 rounded-full mt-0.5"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
