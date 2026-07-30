import React from 'react';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';
import { formatDate } from '../../utils/projectHelpers';

export const ProjectTimeline = ({ startDate, dueDate, milestones = [] }) => {
  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-md">
      <h3 className="text-base font-bold text-slate-100 mb-4 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-indigo-400" /> Key Milestone Deadlines
      </h3>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
        {milestones.map((ms, index) => {
          const isCompleted = ms.status === 'completed';
          return (
            <div key={ms.id || index} className="relative">
              {/* Timeline Dot */}
              <div
                className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 ${
                  isCompleted
                    ? 'bg-emerald-500 border-slate-900 shadow-md shadow-emerald-500/50'
                    : 'bg-slate-800 border-indigo-400'
                }`}
              />

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/40">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-sm font-bold text-slate-200">{ms.title}</h4>
                  <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Due {formatDate(ms.dueDate)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-2">{ms.description}</p>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${ms.completionPercentage || 0}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectTimeline;
