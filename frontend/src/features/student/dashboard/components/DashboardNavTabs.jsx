import React from "react";

export default function DashboardNavTabs({ activeTab, onTabChange, counts = {} }) {
  const tabs = [
    { id: "sessions", label: "Sessions", count: counts.sessions, color: "from-blue-500 to-blue-600" },
    { id: "tasks", label: "Tasks", count: counts.tasks, color: "from-purple-500 to-purple-600" },
    { id: "notifications", label: "Notifications", count: counts.notifications, color: "from-emerald-500 to-emerald-600" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`p-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
              isActive
                ? `bg-gradient-to-r ${tab.color} text-white ring-2 ring-offset-2 ring-blue-500 shadow-md`
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}`}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}