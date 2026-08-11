import React from "react";
import { CheckCircle2, TrendingUp, AlertCircle } from "lucide-react";

export const PerformanceSummary = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-surface-900 dark:text-white">Performance & Evaluation Highlights</h3>
        <span className="px-3 py-1 text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full">
          {summary.overallStatus}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl p-4">
          <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Key Strengths</span>
          </div>
          <ul className="space-y-1.5 text-xs text-surface-700 dark:text-surface-300">
            {summary.strengths?.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-emerald-500">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvement Areas */}
        <div className="bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl p-4">
          <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-300 font-bold text-xs uppercase tracking-wider mb-2">
            <AlertCircle className="w-4 h-4" />
            <span>Recommended Improvements</span>
          </div>
          <ul className="space-y-1.5 text-xs text-surface-700 dark:text-surface-300">
            {summary.improvements?.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-amber-500">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PerformanceSummary;
