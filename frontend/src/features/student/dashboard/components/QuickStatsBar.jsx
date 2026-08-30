import React from "react";

export default function QuickStatsBar({ stats = {} }) {
  const statItems = [
    { label: "XP Earned", value: stats.xpEarned ?? 0, icon: "⚡" },
    { label: "Assignments Done", value: stats.assignmentsCompleted ?? 0, icon: "📋" },
    { label: "Sessions Attended", value: stats.sessionsAttended ?? 0, icon: "🎯" },
    { label: "Overall Score", value: `${stats.overallScore ?? 0}%`, icon: "🏆" }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, idx) => (
        <div key={idx} className="bg-white border rounded-xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold uppercase">
            <span>{item.label}</span>
            <span>{item.icon}</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{item.value}</p>
        </div>
      ))}
    </div>
  );
}