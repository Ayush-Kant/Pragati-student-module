// src/features/student/dashboard/components/tasks/PendingTasks.jsx
import React from 'react';
import TaskCard from './TaskCard';

export default function PendingTasks({ tasks = [] }) {
  const displayTasks = tasks.length > 0 ? tasks : [
    { id: 1, title: "React Core Concepts Quiz", type: "Quiz", deadline: "Today, 11:59 PM", status: "Pending" },
    { id: 2, title: "Tailwind UI Integration", type: "Assignment", deadline: "Tomorrow, 6:00 PM", status: "In Progress" },
    { id: 3, title: "Mentor Sync Call", type: "Session", deadline: "July 8, 2:00 PM", status: "Scheduled" }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
        Pending Tasks & Schedule
      </h3>
      <div className="space-y-3">
        {displayTasks.map((task, idx) => (
          <TaskCard key={task.id || idx} task={task} />
        ))}
      </div>
    </div>
  );
}