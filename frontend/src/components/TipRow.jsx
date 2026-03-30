import React from 'react';

export default function TipRow({ icon, title, desc }) {
  return (
    <div className="flex items-start space-x-3">
      <div className="bg-gray-50 p-2 rounded-lg shrink-0">
        {icon}
      </div>
      <div>
        <h5 className="text-sm font-bold text-gray-800">{title}</h5>
        <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{desc}</p>
      </div>
    </div>
  );
}
