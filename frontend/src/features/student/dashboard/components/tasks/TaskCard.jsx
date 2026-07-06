// src/features/student/dashboard/components/tasks/TaskCard.jsx
import React from 'react';

export default function TaskCard({ task }) {
  if (!task) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-xl gap-2 hover:border-orange-500/30 transition-all duration-200">
      <div className="flex items-start gap-3">
        <span className="text-xs px-2 py-1 font-semibold rounded bg-slate-800 text-orange-400 border border-slate-700">
          {task.type || 'Task'}
        </span>
        <div>
          <h4 className="text-sm font-medium text-white">{task.title}</h4>
          <p className="text-xs text-slate-400 mt-0.5">Due: {task.deadline}</p>
        </div>
      </div>
      <span className="text-xs font-medium px-2.5 py-1 rounded-full self-start sm:self-center bg-orange-500/10 text-orange-400 border border-orange-500/20">
        {task.status || 'Pending'}
      </span>
    </div>
  );
}