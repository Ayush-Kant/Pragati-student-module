import React from 'react';
import * as Icons from 'lucide-react';
import { formatDate, getActivityTypeStyles } from '../../utils/dashboardHelpers';

export const ActivityCard = ({ activity = {}, actionLabel, onAction }) => {
  const { title, date, type, duration, instructor, xpGained } = activity;
  const styles = getActivityTypeStyles(type);

  // Map type to icons
  const getIcon = () => {
    switch (type?.toUpperCase()) {
      case 'EXAM': return Icons.FileSpreadsheet;
      case 'ASSIGNMENT': return Icons.FileCode2;
      case 'CLASS': return Icons.Video;
      case 'STUDY_SESSION': return Icons.Laptop;
      case 'WEBINAR': return Icons.Presentation;
      default: return Icons.CalendarRange;
    }
  };

  const IconComponent = getIcon();

  return (
    <div className={`p-4 rounded-xl glass-card border ${styles.border} flex items-center justify-between gap-4 transition-all duration-300 hover:bg-slate-800/40`}>
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-lg ${styles.bg} ${styles.text} border ${styles.border}`}>
          <IconComponent className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-200 line-clamp-1">{title}</h4>
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 mt-1 text-[11px] text-gray-400 font-medium">
            <span>{formatDate(date)}</span>
            {duration && (
              <>
                <span className="text-gray-600">•</span>
                <span>{duration}</span>
              </>
            )}
            {instructor && (
              <>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400">{instructor}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {xpGained !== undefined && (
          <span className="text-xs font-extrabold text-neon-gold bg-neon-gold/10 px-2 py-0.5 rounded border border-neon-gold/20 shadow-sm">
            +{xpGained} XP
          </span>
        )}
        
        {actionLabel && onAction && (
          <button
            onClick={() => onAction && onAction(activity)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 text-white ${
              type === 'ASSIGNMENT' 
                ? 'bg-gradient-to-r from-neon-indigo to-neon-violet shadow-[0_0_8px_rgba(139,92,246,0.3)] hover:brightness-110'
                : 'bg-slate-800 hover:bg-slate-700 border border-white/5'
            }`}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default ActivityCard;
