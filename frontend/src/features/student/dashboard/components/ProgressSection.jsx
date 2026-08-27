import React from "react";

export default function ProgressSection({ progressRing = {} }) {
  const percent = Math.min(Math.max(progressRing.completionPercent ?? 0, 0), 100);

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
      <h3 className="font-bold text-gray-900">Your Progress</h3>
      
      <div className="flex items-center gap-6">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-gray-200"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-blue-600"
              strokeDasharray={`${percent}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className="absolute text-sm font-bold text-gray-800">{percent}%</span>
        </div>

        <div className="space-y-1 text-xs text-gray-600">
          <p>• Course Completion</p>
          <p>• Profile Completion</p>
          <p>• Assessment Progress</p>
          <p>• Project Progress</p>
        </div>
      </div>
    </div>
  );
}