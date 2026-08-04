import React from 'react';

export const MilestoneProgress = ({ percentage = 0 }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1.5">
        <span>Completion Progress</span>
        <span className="text-indigo-400 font-extrabold">{percentage}%</span>
      </div>
      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-700/50">
        <div
          className="bg-gradient-to-r from-indigo-600 to-indigo-400 h-full rounded-full transition-all duration-500 shadow-sm shadow-indigo-500/50"
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
    </div>
  );
};

export default MilestoneProgress;
