import React from "react";

export default function TimerWarning({ message = "Time is running low!" }) {
  return (
    <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
      ⚠️ {message}
    </div>
  );
}