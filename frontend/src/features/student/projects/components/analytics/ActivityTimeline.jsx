import React from 'react';
import { Activity, CheckCircle2, FileUp, Code, Award } from 'lucide-react';
import { formatDateTime } from '../../utils/projectHelpers';

export const ActivityTimeline = ({ activities = [] }) => {
  const getIcon = (iconType) => {
    switch (iconType) {
      case 'check-circle':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'file':
        return <FileUp className="w-4 h-4 text-indigo-400" />;
      case 'code':
        return <Code className="w-4 h-4 text-blue-400" />;
      case 'award':
        return <Award className="w-4 h-4 text-amber-400" />;
      default:
        return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-6 shadow-xl h-full">
      <h3 className="text-base font-bold text-slate-100 mb-4 flex items-center gap-2">
        <Activity className="w-4 h-4 text-indigo-400" /> Recent Activity Stream
      </h3>

      {activities.length === 0 ? (
        <p className="text-xs text-slate-400 italic">No recent activity logged.</p>
      ) : (
        <div className="space-y-4 relative pl-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
          {activities.map((act) => (
            <div key={act.id} className="relative flex items-start gap-3">
              <div className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-slate-800" />
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/40 w-full">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[11px] font-bold text-slate-200">{act.user}</span>
                  <span className="text-[10px] text-slate-400">{formatDateTime(act.date)}</span>
                </div>
                <p className="text-xs text-slate-300 flex items-center gap-1.5">
                  {getIcon(act.icon)}
                  {act.action}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;
