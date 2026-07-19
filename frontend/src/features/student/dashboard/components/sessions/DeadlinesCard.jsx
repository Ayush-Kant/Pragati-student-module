import React from "react";
import PropTypes from "prop-types";

export default function DeadlinesCard({ tasks = [], loading }) {
  if (loading) return <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />;

  const highPriorityTasks = tasks.filter(t => !t.done);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h4 className="text-xs font-bold uppercase tracking-wider text-red-500 mb-3 flex items-center gap-1">
        ⏳ Imminent Deadlines
      </h4>
      {highPriorityTasks.length > 0 ? (
        <div className="space-y-2.5">
          {highPriorityTasks.slice(0, 2).map((task) => (
            <div key={task.id} className="flex justify-between items-center text-xs">
              <span className="text-gray-700 font-medium truncate max-w-[160px]">{task.title}</span>
              <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded font-semibold shrink-0">Today</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-400 italic">No pressing deliverables today.</p>
      )}
    </div>
  );
}

DeadlinesCard.propTypes = {
  tasks: PropTypes.array,
  loading: PropTypes.bool,
};