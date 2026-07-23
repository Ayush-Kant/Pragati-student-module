import React from "react";
import PropTypes from "prop-types";

export default function QuickActions({ onActionClick }) {
  const actions = [
    { id: "drives", label: "View Active Drives", icon: "💼" },
    { id: "mock", label: "Schedule Mock Call", icon: "📞" },
    { id: "resume", label: "Update Resume", icon: "📄" },
  ];

  const handleClick = (actionId) => {
    if (onActionClick) {
      onActionClick(actionId);
    } else {
      console.log(`Triggered quick action: ${actionId}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
      <h3 className="text-sm font-bold text-gray-800 mb-3">⚡ Quick Actions</h3>
      <div className="grid grid-cols-3 gap-2">
        {actions.map((act) => (
          <button
            key={act.id}
            type="button"
            onClick={() => handleClick(act.id)}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors text-center cursor-pointer active:scale-95"
          >
            <span className="text-lg mb-1">{act.icon}</span>
            <span className="text-xs font-medium text-gray-600">{act.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

QuickActions.propTypes = {
  onActionClick: PropTypes.func,
};