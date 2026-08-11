import React from "react";
import { CheckSquare, Square } from "lucide-react";

export const TaskChecklist = ({ checklist = [], milestoneId, taskId, onToggle }) => {
  if (!checklist || checklist.length === 0) return null;

  return (
    <div className="mt-3 space-y-1.5 pt-2 border-t border-surface-100 dark:border-surface-700/60">
      <p className="text-[11px] font-bold text-surface-400 dark:text-surface-500 uppercase tracking-wider">
        Subtasks Checklist
      </p>
      {checklist.map((item) => (
        <button
          key={item.id}
          onClick={() => onToggle && onToggle(milestoneId, taskId, item.id)}
          className="w-full flex items-center space-x-2 text-left group p-1 rounded hover:bg-surface-100/60 dark:hover:bg-surface-700/40 transition-colors"
        >
          {item.completed ? (
            <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <Square className="w-4 h-4 text-surface-400 group-hover:text-brand-500 shrink-0 transition-colors" />
          )}
          <span
            className={`text-xs ${
              item.completed
                ? "line-through text-surface-400 dark:text-surface-500"
                : "text-surface-700 dark:text-surface-300 font-medium"
            }`}
          >
            {item.text}
          </span>
        </button>
      ))}
    </div>
  );
};

export default TaskChecklist;
