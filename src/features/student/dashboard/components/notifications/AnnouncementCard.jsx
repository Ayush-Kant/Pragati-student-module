import React from 'react';
import { Bell, Info, AlertTriangle, CheckCircle, CalendarClock } from 'lucide-react';
import { formatRelativeTime } from '../../utils/dashboardHelpers';

export const AnnouncementCard = ({ notifications = [], onMarkAsRead }) => {
  const getNotificationStyles = (type) => {
    switch (type?.toUpperCase()) {
      case 'WARNING':
        return {
          icon: AlertTriangle,
          color: 'text-neon-gold bg-neon-gold/10 border-neon-gold/20'
        };
      case 'SUCCESS':
        return {
          icon: CheckCircle,
          color: 'text-neon-emerald bg-neon-emerald/10 border-neon-emerald/20'
        };
      case 'DEADLINE':
        return {
          icon: CalendarClock,
          color: 'text-neon-coral bg-neon-coral/10 border-neon-coral/20'
        };
      default:
        return {
          icon: Info,
          color: 'text-neon-cyan bg-neon-cyan/10 border-neon-cyan/20'
        };
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="glass-card p-5 rounded-2xl border border-white/5 h-full">
      <div className="flex items-center justify-between pb-4 border-b border-space-border mb-4">
        <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
          <Bell className="w-4 h-4 text-neon-violet" /> Announcement Desk
        </h3>
        {unreadCount > 0 && (
          <span className="text-[10px] font-extrabold text-neon-coral bg-neon-coral/10 px-2 py-0.5 rounded-full border border-neon-coral/20 animate-pulse">
            {unreadCount} NEW
          </span>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-6 text-gray-500 text-xs">No active announcements.</div>
      ) : (
        <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
          {notifications.map((notification) => {
            const { icon: IconComponent, color: styleColor } = getNotificationStyles(notification.type);
            return (
              <div 
                key={notification.id}
                onClick={() => onMarkAsRead && onMarkAsRead(notification.id)}
                className={`p-3 rounded-xl border transition-all duration-200 flex gap-3 text-left cursor-pointer ${
                  notification.isRead 
                    ? 'bg-slate-900/20 border-white/5 opacity-60 hover:opacity-80' 
                    : 'bg-slate-900/50 border-white/10 hover:border-neon-indigo/20 shadow-md shadow-neon-indigo/5'
                }`}
              >
                <div className={`p-2.5 rounded-lg border h-fit shrink-0 ${styleColor}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-xs font-extrabold text-gray-200 line-clamp-1">
                      {notification.title}
                    </h4>
                    <span className="text-[9px] font-medium text-gray-500 shrink-0 uppercase tracking-tight">
                      {formatRelativeTime(notification.date)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    {notification.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AnnouncementCard;
