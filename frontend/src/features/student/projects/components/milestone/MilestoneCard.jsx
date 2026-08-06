import React, { useState } from "react";
import { ChevronDown, ChevronUp, Calendar, CheckCircle2 } from "lucide-react";
import MilestoneProgress from "./MilestoneProgress";
import TaskCard from "./TaskCard";
import { formatDate } from "../../utils/projectHelpers";

export const MilestoneCard = ({ milestone, onToggleTaskChecklist }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const completedCount = milestone.tasks?.filter((t) => t.status === "COMPLETED").length || 0;

  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-sm overflow-hidden mb-4 transition-all">
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 flex items-center justify-between cursor-pointer hover:bg-surface-50/50 dark:hover:bg-surface-700/40 transition-colors"
      >
        <div className="flex items-start space-x-3.5">
          <div
            className={`p-2.5 rounded-xl ${
              milestone.status === "COMPLETED"
                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
                : "bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400"
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h4 className="text-base font-bold text-surface-900 dark:text-white">{milestone.title}</h4>
              <span className="text-xs text-surface-500 dark:text-surface-400">
                ({completedCount}/{milestone.tasks?.length || 0} tasks)
              </span>
            </div>
            <p className="text-xs text-surface-500 dark:text-surface-400 line-clamp-1">{milestone.description}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-1 text-xs text-surface-500 dark:text-surface-400">
            <Calendar className="w-3.5 h-3.5 text-surface-400" />
            <span>Due {formatDate(milestone.dueDate)}</span>
          </div>
          <button className="p-1 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Progress & Content */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-2 border-t border-surface-100 dark:border-surface-700/80">
          <div className="mb-4">
            <MilestoneProgress percent={milestone.progressPercent} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {milestone.tasks?.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                milestoneId={milestone.id}
                onToggleChecklist={onToggleTaskChecklist}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestoneCard;
