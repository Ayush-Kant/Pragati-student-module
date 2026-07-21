import React from 'react';
import { Bell, CheckCircle2, CircleCheck, Inbox, X } from 'lucide-react';
import { formatRelativeTime } from '../../utils/dashboardHelpers';

export const NotificationPreview = ({ 
  notifications = [], 
  onClose, 
  onMarkAllRead,
  onNotificationClick 
}) => {
  const unreadList = notifications.filter(n => !n.isRead);

  return (
    <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-card border border-white/10 shadow-2xl p-4 z-50 animate-float-slow">
      <div className="flex items-center justify-between pb-3 border-b border-space-border mb-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-neon-violet" />
          <h4 className="text-sm font-bold text-gray-200">System Alerts</h4>
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg hover:bg-slate-800 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Inbox className="w-8 h-8 text-gray-600 mb-2" />
          <p className="text-xs text-gray-500 font-medium">All caught up! No alerts.</p>
        </div>
      ) : (
        <>
          <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
            {notifications.slice(0, 5).map((n) => (
              <button
                key={n.id}
                onClick={() => onNotificationClick && onNotificationClick(n.id)}
                className={`w-full p-2.5 rounded-lg text-left transition-colors duration-200 border flex flex-col gap-0.5 ${
                  n.isRead 
                    ? 'bg-transparent border-transparent hover:bg-slate-900/30' 
                    : 'bg-neon-indigo/5 border-neon-indigo/10 hover:bg-neon-indigo/10'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className={`text-xs font-extrabold ${n.isRead ? 'text-gray-400' : 'text-gray-200'}`}>
                    {n.title}
                  </span>
                  <span className="text-[8px] font-bold text-gray-500 uppercase tracking-tight">
                    {formatRelativeTime(n.date)}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed mt-0.5">
                  {n.message}
                </p>
              </button>
            ))}
          </div>

          {unreadList.length > 0 && onMarkAllRead && (
            <button
              onClick={onMarkAllRead}
              className="w-full mt-3 pt-3 border-t border-space-border flex items-center justify-center gap-1.5 text-[10px] font-bold text-neon-cyan hover:text-white transition-colors duration-200 uppercase tracking-wider"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Mark all as read
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default NotificationPreview;
