import React from "react";
import { CheckCircle2, Clock, GitCommit, Award } from "lucide-react";
import { formatDate } from "../../utils/projectHelpers";

export const FeedbackTimeline = ({ timeline = [] }) => {
  if (!timeline || timeline.length === 0) return null;

  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 shadow-sm mb-6">
      <h3 className="text-base font-bold text-surface-900 dark:text-white mb-6">Feedback & Review Activity Timeline</h3>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-200 dark:before:bg-surface-700">
        {timeline.map((item) => (
          <div key={item.id} className="relative flex items-start space-x-3 group">
            {/* Dot indicator */}
            <div className="absolute -left-6 top-0.5 p-1 bg-white dark:bg-surface-800 ring-4 ring-white dark:ring-surface-800 rounded-full">
              <div className="w-2.5 h-2.5 bg-brand-600 rounded-full group-hover:scale-125 transition-transform" />
            </div>

            <div>
              <h4 className="text-xs font-bold text-surface-900 dark:text-white">{item.title}</h4>
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{item.description}</p>
              <span className="inline-block text-[10px] text-surface-400 dark:text-surface-500 mt-1">
                {formatDate(item.date, true)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackTimeline;
