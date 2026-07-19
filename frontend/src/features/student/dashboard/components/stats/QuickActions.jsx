import React from 'react';

export default function QuickActions() {
  const actions = [
    { label: "View Active Drives", icon: "💼" },
    { label: "Schedule Mock Call", icon: "📞" },
    { label: "Update Resume", icon: "📄" }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
      <h3 className="text-sm font-bold text-gray-800 mb-3">⚡ Quick Actions</h3>
      <div className="grid grid-cols-3 gap-2">
        {actions.map((act, i) => (
          <button key={i} className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors text-center">
            <span className="text-lg mb-1">{act.icon}</span>
            <span className="text-xs font-medium text-gray-600">{act.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}