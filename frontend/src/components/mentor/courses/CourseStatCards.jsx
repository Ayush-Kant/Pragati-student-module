import React from 'react';

const STATS_CONFIG = [
  { title: "Total Courses", value: "24", trend: "+4 this month", color: "bg-blue-500", icon: "📘" },
  { title: "Published Courses", value: "18", trend: "+3 this month", color: "bg-emerald-500", icon: "▶" },
  { title: "Draft Courses", value: "4", trend: "+1 this month", color: "bg-orange-400", icon: "✎" },
  { title: "Total Enrollments", value: "1,248", trend: "+12% this month", color: "bg-purple-500", icon: "👥" },
];

export default function CourseStatCards() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {STATS_CONFIG.map((item, index) => (
        <div key={index} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">{item.title}</p>
              <h2 className="mt-2 text-4xl font-bold text-gray-900">{item.value}</h2>
              <p className="mt-3 text-sm font-medium text-emerald-600">{item.trend} ↗</p>
            </div>
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl text-white ${item.color}`}>
              {item.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}