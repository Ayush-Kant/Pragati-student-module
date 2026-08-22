import React from "react";

export default function PerformanceChart({ percentage = 0 }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
      <h4 className="font-semibold text-gray-800">Performance Overview</h4>
      <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden flex">
        <div
          className="bg-green-500 h-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
        <div
          className="bg-red-400 h-full transition-all duration-500"
          style={{ width: `${100 - percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 font-medium pt-1">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"/> Correct ({percentage}%)</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block"/> Incorrect ({100 - percentage}%)</span>
      </div>
    </div>
  );
}