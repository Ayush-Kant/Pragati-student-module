import React from 'react';
import { CalendarClock, AlertTriangle } from 'lucide-react';
import { formatRemainingTime, formatDate } from '../../utils/dashboardHelpers';

export const DeadlineCard = ({ activity = {}, onAction }) => {
  const { title, date, urgency } = activity;
  const timeRemaining = formatRemainingTime(date);
  const isUrgent = urgency === 'high' || timeRemaining === 'Overdue' || timeRemaining.includes('h left');

  return (
    <div className={`p-4 rounded-xl glass-card border flex items-center justify-between gap-4 transition-all duration-300 ${
      isUrgent ? 'border-neon-coral/30 bg-neon-coral/5 hover:bg-neon-coral/10' : 'border-white/5 hover:border-white/10'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`p-2.5 rounded-lg border mt-0.5 ${
          isUrgent 
            ? 'bg-neon-coral/10 text-neon-coral border-neon-coral/20' 
            : 'bg-slate-800/60 text-gray-400 border-white/5'
        }`}>
          <CalendarClock className="w-5 h-5 animate-pulse-slow" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-gray-200 line-clamp-1">{title}</h4>
            {isUrgent && (
              <span className="flex items-center gap-0.5 text-[9px] font-extrabold text-neon-coral bg-neon-coral/10 border border-neon-coral/20 px-1.5 py-0.2 rounded uppercase">
                <AlertTriangle className="w-2.5 h-2.5" /> Critical
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-400 mt-1 font-semibold">
            Due: {formatDate(date)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
          isUrgent 
            ? 'text-neon-coral bg-neon-coral/15 border-neon-coral/20 shadow-[0_0_8px_rgba(239,68,68,0.2)]'
            : 'text-gray-300 bg-slate-900 border-white/5'
        }`}>
          {timeRemaining}
        </span>
        {onAction && (
          <button
            onClick={() => onAction(activity)}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-neon-indigo to-neon-violet hover:from-neon-violet hover:to-neon-indigo text-white shadow-lg transition-all duration-300 transform active:scale-95"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default DeadlineCard;
