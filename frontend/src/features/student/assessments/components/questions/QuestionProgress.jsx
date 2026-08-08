import React from "react";

export default function QuestionProgress({ current = 1, total = 1 }) {
  const percentage = Math.min(Math.round((current / total) * 100), 100);

  return (
    <div className="space-y-1 w-full">
      <div className="flex justify-between text-xs text-gray-500 font-medium">
        <span>Question Progress</span>
        <span>{current} / {total} ({percentage}%)</span>
      </div>
      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
        <div
          className="bg-blue-600 h-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}