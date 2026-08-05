import React from "react";
import PropTypes from "prop-types";

export default function DeadlinesCard({ tasks = [], loading }) {
  if (loading) {
    return <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />;
  }

  // Filter tasks using status !== 'completed' or done === false
  const pendingTasks = tasks.filter((t) =>
    t.status ? t.status !== "completed" : !t.done
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h4 className="text-xs font-bold uppercase tracking-wider text-red-500 mb-3 flex items-center gap-1">
        ⏳ Imminent Deadlines
      </h4>
      {pendingTasks.length > 0 ? (
        <div className="space-y-2.5">
          {pendingTasks.slice(0, 3).map((task, idx) => {
            const title = task.title || task.name || task.taskName || "Untitled Task";
            const deadline = task.dueDate || task.deadline || task.date || "Pending";

            return (
              <div key={task.id || idx} className="flex justify-between items-center text-xs">
                <span className="text-gray-700 font-medium truncate max-w-[160px]">
                  {title}
                </span>
                <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded font-semibold shrink-0">
                  {deadline}
                </span>
              </div>
            );
          })}
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