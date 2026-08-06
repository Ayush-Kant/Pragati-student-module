import React from "react";
import { formatTime } from "../../utils/assessmentHelpers";

export default function AssessmentTimer({ timeLeft }) {
  const isWarning = timeLeft < 300;

  return (
    <div
      className={`px-4 py-2 rounded-lg font-mono font-bold text-lg border ${
        isWarning
          ? "bg-red-50 text-red-600 border-red-300 animate-pulse"
          : "bg-blue-50 text-blue-600 border-blue-200"
      }`}
    >
      ⏱️ {formatTime(timeLeft)}
    </div>
  );
}