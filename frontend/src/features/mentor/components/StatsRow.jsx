import React from "react";

const stats = [
  { key: "totalMentees",      label: "Total Mentees",      icon: "👥", bg: "bg-blue-50",   iconBg: "bg-blue-100",   iconColor: "text-blue-600",   trend: "+12 this month" },
  { key: "activeSessions",    label: "Active Sessions",    icon: "📅", bg: "bg-green-50",  iconBg: "bg-green-100",  iconColor: "text-green-600",  trend: "+4 this week" },
  { key: "assessments",       label: "Assessments",        icon: "📋", bg: "bg-orange-50", iconBg: "bg-orange-100", iconColor: "text-orange-600", trend: "+6 this month" },
  { key: "tasksAssigned",     label: "Tasks Assigned",     icon: "🟣", bg: "bg-purple-50", iconBg: "bg-purple-100", iconColor: "text-purple-600", trend: "+8 this week" },
  { key: "placementProgress", label: "Placement Progress", icon: "🎯", bg: "bg-pink-50",   iconBg: "bg-pink-100",   iconColor: "text-pink-600",   trend: "+9% this month", suffix: "%" },
];

const StatsRow = (props) => {
  return (
    <div className="grid grid-cols-5 gap-4 mb-5">
      {stats.map((stat, i) => (
        <div key={i} className={`${stat.bg} rounded-2xl p-4 shadow-sm`}>
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-9 h-9 ${stat.iconBg} rounded-xl flex items-center justify-center text-lg`}>
              {stat.icon}
            </div>
            <p className="text-xs text-gray-500 font-medium leading-tight">{stat.label}</p>
          </div>
          <p className="text-3xl font-black text-gray-800">
            {props[stat.key] ?? 0}{stat.suffix ?? ""}
          </p>
          <p className="text-xs text-green-600 mt-1 font-medium">↑ {stat.trend}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsRow;