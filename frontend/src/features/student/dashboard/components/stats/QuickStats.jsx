// src/features/student/dashboard/components/stats/QuickStats.jsx
import React from 'react';
import StatCard from './StatCard';

export default function QuickStats({ stats = [] }) {
  // Fallback defaults matching the ticket requirements if data isn't loaded yet
  const displayStats = stats.length > 0 ? stats : [
    { title: "Completed Courses", value: "8", icon: "🎓" },
    { title: "Active Courses", value: "3", icon: "📚" },
    { title: "Attendance", value: "92%", icon: "📅" },
    { title: "Total XP", value: "1450", icon: "✨" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {displayStats.map((stat, idx) => (
        <StatCard 
          key={idx}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
        />
      ))}
    </div>
  );
}