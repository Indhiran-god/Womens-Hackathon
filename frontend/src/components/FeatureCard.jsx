import React from 'react';

export default function FeatureCard({ icon, title, subtitle, color, onClick }) {
  return (
    <div onClick={onClick} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all active:scale-[0.98] group">
      <div className={`${color} text-white w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-inner group-hover:scale-105 transition-transform`}>
        {icon}
      </div>
      <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}
