import React from 'react';
import { getMilestoneStatus, formatDate } from '../../utils/projectHelpers';
import { STATUS_STYLES } from '../../constants/projectConstants';
import { Check, X, Clock } from 'lucide-react';

/**
 * MilestoneTimeline component.
 * Displays vertical timeline on desktop, collapses to horizontal scrollable stepper on mobile.
 */
export const MilestoneTimeline = ({ 
  milestones = [], 
  selectedMilestoneId, 
  onSelectMilestone 
}) => {
  
  // Icon picker based on milestone status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Submitted':
        return <Check className="w-4.5 h-4.5 text-pragati-success" strokeWidth={3} />;
      case 'Deadline Passed':
        return <X className="w-4.5 h-4.5 text-pragati-danger" strokeWidth={3} />;
      default:
        return <Clock className="w-4.5 h-4.5 text-slate-400" />;
    }
  };

  return (
    <div className="w-full">
      <h3 className="hidden md:block text-lg font-bold text-pragati-text mb-6 tracking-wide uppercase text-xs text-pragati-muted">
        Milestone Timeline
      </h3>

      {/* MOBILE TIMELINE: Horizontal Scrollable Stepper */}
      <div className="md:hidden flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin scrollbar-thumb-pragati-border scrollbar-track-transparent">
        {milestones.map((m) => {
          const status = getMilestoneStatus(m);
          const style = STATUS_STYLES[status];
          const isSelected = selectedMilestoneId === m.id;

          return (
            <button
              key={m.id}
              onClick={() => onSelectMilestone(m)}
              className={`flex-none w-64 snap-start text-left p-4 rounded-xl border transition-all duration-300 ${
                isSelected 
                  ? 'bg-pragati-surface border-pragati-accent shadow-md shadow-pragati-accent/5' 
                  : 'bg-pragati-surface/60 border-pragati-border hover:border-pragati-border/80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-pragati-accent">
                  Milestone {m.number}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border ${style.bg} ${style.text} ${style.border}`}>
                  {status}
                </span>
              </div>
              <h4 className="text-sm font-bold text-pragati-text truncate">{m.title}</h4>
              <p className="text-[11px] text-pragati-muted mt-1">
                Due: {formatDate(m.dueAt)}
              </p>
            </button>
          );
        })}
      </div>

      {/* DESKTOP TIMELINE: Vertical Connected Steps */}
      <div className="hidden md:block relative pl-8 space-y-8">
        {/* Vertical Line */}
        <div className="absolute left-[47px] top-4 bottom-4 w-0.5 bg-pragati-border z-0"></div>

        {milestones.map((m) => {
          const status = getMilestoneStatus(m);
          const style = STATUS_STYLES[status];
          const isSelected = selectedMilestoneId === m.id;

          return (
            <div 
              key={m.id} 
              className="relative pl-12 group cursor-pointer z-10"
              onClick={() => onSelectMilestone(m)}
            >
              {/* Connector Node */}
              <div className={`absolute left-0 top-1.5 w-8 h-8 rounded-full flex items-center justify-center bg-pragati-bg border-2 transition-all duration-300 z-20 ${
                isSelected 
                  ? 'border-pragati-accent scale-110 shadow-lg shadow-pragati-accent/10' 
                  : 'border-pragati-border group-hover:border-pragati-muted'
              }`}>
                {getStatusIcon(status)}
              </div>

              {/* Card Container */}
              <div className={`p-5 rounded-xl border transition-all duration-300 ${
                isSelected 
                  ? 'bg-pragati-surface border-pragati-accent shadow-lg shadow-pragati-accent/5' 
                  : 'bg-pragati-surface/50 border-pragati-border/60 hover:bg-pragati-surface hover:border-pragati-border'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-pragati-accent uppercase tracking-wider">
                    Milestone {m.number}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${style.bg} ${style.text} ${style.border}`}>
                    {status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-pragati-text group-hover:text-pragati-accent transition-colors duration-200">
                  {m.title}
                </h4>
                <p className="text-xs text-pragati-muted mt-1.5">
                  Due: {formatDate(m.dueAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MilestoneTimeline;
