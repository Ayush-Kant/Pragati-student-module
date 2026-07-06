// src/features/student/dashboard/components/stats/StatCard.jsx
import React from 'react';

export default function StatCard({ title, value, icon, description }) {
  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-sm flex items-center justify-between transition-all duration-200 hover:border-orange-500/30 hover:-translate-y-0.5">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-white tracking-tight">
          {value}
        </h3>
        {description && (
          <p className="text-xs text-slate-500">
            {description}
          </p>
        )}
      </div>
      <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-xl shadow-inner">
        {icon || '📊'}
      </div>
    </div>
  );
}