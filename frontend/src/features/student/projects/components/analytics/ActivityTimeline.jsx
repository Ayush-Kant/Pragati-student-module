import React from "react";
import { formatDate } from "../../utils/projectHelpers";

export const ActivityTimeline = ({ activities = [] }) => {
  if (!activities || activities.length === 0) return null;

  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 shadow-sm mb-6">
      <h3 className="text-base font-bold text-surface-900 dark:text-white mb-4">Recent Project Activity</h3>

      <div className="space-y-4">
        {activities.map((act) => (
          <div
            key={act.id}
            className="flex items-start space-x-3.5 p-3 rounded-xl bg-surface-50 dark:bg-surface-900/50 border border-surface-100 dark:border-surface-700/60"
          >
            <img
              src={act.avatar}
              alt={act.user}
              className="w-9 h-9 rounded-full object-cover ring-1 ring-surface-300 dark:ring-surface-600 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-surface-900 dark:text-white">{act.user}</span>
                <span className="text-[10px] text-surface-400">{formatDate(act.timestamp, true)}</span>
              </div>
              <p className="text-xs text-brand-600 dark:text-brand-400 font-medium mt-0.5">{act.action}</p>
              <p className="text-xs text-surface-500 dark:text-surface-400 truncate">{act.details}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTimeline;
