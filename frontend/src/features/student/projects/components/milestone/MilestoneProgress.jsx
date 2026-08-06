import React from "react";

export const MilestoneProgress = ({ percent = 0 }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center text-xs font-semibold mb-1">
        <span className="text-surface-500 dark:text-surface-400">Milestone Progress</span>
        <span className="text-brand-600 dark:text-brand-400">{percent}%</span>
      </div>
      <div className="w-full h-2 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-indigo-600 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default MilestoneProgress;
