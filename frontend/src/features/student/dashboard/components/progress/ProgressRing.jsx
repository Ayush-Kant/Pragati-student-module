// src/features/student/dashboard/components/progress/ProgressRing.jsx
import React from 'react';

export default function ProgressRing({ percentage = 75 }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 w-full text-left">
        Course Progression
      </h3>
      <div className="relative w-32 h-32 flex items-center justify-center mb-2">
        {/* Simple visual fallback circle container using custom background track styles */}
        <div className="absolute inset-0 rounded-full border-8 border-slate-800"></div>
        <div className="absolute inset-0 rounded-full border-8 border-orange-500 border-t-transparent border-r-transparent animate-pulse opacity-40"></div>
        <div className="absolute text-2xl font-bold text-white">{percentage}%</div>
      </div>
      <p className="text-xs text-slate-400 max-w-[200px] mt-2">
        Track overall completion benchmarks across modules.
      </p>
    </div>
  );
}