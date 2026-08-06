import React from "react";
import { Calendar } from "lucide-react";
import TaskStatusBadge from "./TaskStatusBadge";
import TaskChecklist from "./TaskChecklist";
import { formatDate } from "../../utils/projectHelpers";

export const TaskCard = ({ task, milestoneId, onToggleChecklist }) => {
  return (
    <div className="bg-surface-50/80 dark:bg-surface-900/60 rounded-xl border border-surface-200/80 dark:border-surface-700/80 p-4 transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h5 className="text-sm font-bold text-surface-900 dark:text-white leading-snug">{task.title}</h5>
        <TaskStatusBadge status={task.status} />
      </div>

      {task.description && (
        <p className="text-xs text-surface-600 dark:text-surface-400 mb-3 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Assignee & Due Date */}
      <div className="flex items-center justify-between text-[11px] text-surface-500 dark:text-surface-400 pb-2">
        {task.assignee && (
          <div className="flex items-center space-x-1.5">
            <img
              src={task.assignee.avatar}
              alt={task.assignee.name}
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="font-medium text-surface-700 dark:text-surface-300">{task.assignee.name}</span>
          </div>
        )}
        <div className="flex items-center space-x-1">
          <Calendar className="w-3 h-3 text-surface-400" />
          <span>Due {formatDate(task.dueDate)}</span>
        </div>
      </div>

      {/* Checklist */}
      <TaskChecklist
        checklist={task.checklist}
        milestoneId={milestoneId}
        taskId={task.id}
        onToggle={onToggleChecklist}
      />
    </div>
  );
};

export default TaskCard;
