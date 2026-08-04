import React from 'react';
import { CheckSquare, Square, Clock, User } from 'lucide-react';
import TaskStatusBadge from './TaskStatusBadge';
import { TASK_STATUS } from '../../constants/projectConstants';

export const TaskCard = ({ task, onStatusChange }) => {
  const { id, title, status, assignee } = task;

  const handleToggle = () => {
    if (!onStatusChange) return;
    const nextStatus =
      status === TASK_STATUS.DONE
        ? TASK_STATUS.TODO
        : status === TASK_STATUS.TODO
        ? TASK_STATUS.IN_PROGRESS
        : TASK_STATUS.DONE;

    onStatusChange(id, nextStatus);
  };

  return (
    <div
      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
        status === TASK_STATUS.DONE
          ? 'bg-slate-900/40 border-slate-800/80 text-slate-400'
          : 'bg-slate-900/90 border-slate-700/60 hover:border-indigo-500/40 text-slate-200 shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggle}
          className="text-slate-400 hover:text-indigo-400 transition-colors shrink-0"
          title="Click to toggle task status"
        >
          {status === TASK_STATUS.DONE ? (
            <CheckSquare className="w-5 h-5 text-emerald-400" />
          ) : (
            <Square className="w-5 h-5 text-slate-500 hover:text-indigo-400" />
          )}
        </button>

        <div>
          <h5
            className={`text-xs font-semibold ${
              status === TASK_STATUS.DONE ? 'line-through text-slate-400' : 'text-slate-200'
            }`}
          >
            {title}
          </h5>
          {assignee && (
            <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
              <User className="w-3 h-3 text-slate-400" /> {assignee}
            </span>
          )}
        </div>
      </div>

      {/* Select Dropdown to change status directly */}
      <div className="flex items-center gap-2">
        <select
          value={status}
          onChange={(e) => onStatusChange && onStatusChange(id, e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-semibold rounded-lg px-2 py-1 focus:outline-none focus:border-indigo-500"
        >
          <option value={TASK_STATUS.TODO}>To Do</option>
          <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
          <option value={TASK_STATUS.DONE}>Done</option>
        </select>
        <TaskStatusBadge status={status} />
      </div>
    </div>
  );
};

export default TaskCard;
