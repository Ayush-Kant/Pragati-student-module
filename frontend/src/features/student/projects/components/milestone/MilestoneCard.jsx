import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, CheckCircle2, Clock } from 'lucide-react';
import MilestoneProgress from './MilestoneProgress';
import TaskCard from './TaskCard';
import { formatDate } from '../../utils/projectHelpers';

export const MilestoneCard = ({ milestone, onTaskStatusChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { title, description, dueDate, status, completionPercentage = 0, tasks = [] } = milestone;

  return (
    <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-6 shadow-lg transition-all hover:border-slate-600">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
              status === 'completed'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">{title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
          <span className="text-xs text-indigo-300 font-medium flex items-center gap-1.5 px-3 py-1 bg-slate-900/60 rounded-lg border border-slate-700/40">
            <Clock className="w-3.5 h-3.5" /> Due {formatDate(dueDate)}
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-700/40 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <MilestoneProgress percentage={completionPercentage} />
      </div>

      {/* Accordion Nested Tasks List */}
      {isExpanded && (
        <div className="pt-4 border-t border-slate-700/40 space-y-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Sub-Tasks ({tasks.filter((t) => t.status === 'done').length} / {tasks.length} Completed)
          </p>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onStatusChange={onTaskStatusChange} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MilestoneCard;
