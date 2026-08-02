import React from "react";
import { 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Check, 
  ExternalLink,
  MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotificationList({ notifications, onMarkRead }) {
  const navigate = useNavigate();

  const getSeverityStyles = (type) => {
    switch (type) {
      case "alert":
        return {
          bg: "bg-red-50 hover:bg-red-100/70 border-red-200",
          accentBar: "bg-red-500",
          text: "text-red-800",
          icon: <AlertCircle className="w-5 h-5 text-red-500" />,
          badge: "bg-red-100 text-red-700"
        };
      case "warning":
        return {
          bg: "bg-amber-50 hover:bg-amber-100/70 border-amber-200",
          accentBar: "bg-amber-500",
          text: "text-amber-800",
          icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
          badge: "bg-amber-100 text-amber-700"
        };
      case "success":
        return {
          bg: "bg-emerald-50 hover:bg-emerald-100/70 border-emerald-200",
          accentBar: "bg-emerald-500",
          text: "text-emerald-800",
          icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
          badge: "bg-emerald-100 text-emerald-700"
        };
      case "info":
      default:
        return {
          bg: "bg-blue-50 hover:bg-blue-100/70 border-blue-200",
          accentBar: "bg-blue-500",
          text: "text-blue-800",
          icon: <Info className="w-5 h-5 text-blue-500" />,
          badge: "bg-blue-100 text-blue-700"
        };
    }
  };

  const handleActionClick = (notification) => {
    if (notification.actionLink) {
      if (notification.actionLink.startsWith("http")) {
        window.open(notification.actionLink, "_blank", "noopener,noreferrer");
      } else {
        navigate(notification.actionLink);
      }
    }
  };

  if (!notifications || notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-slate-400 bg-white rounded-xl border border-slate-100 shadow-sm">
        <Info className="w-12 h-12 text-slate-300 mb-3 stroke-[1.5]" />
        <p className="text-base font-medium text-slate-500">No notifications found</p>
        <p className="text-xs text-slate-400 mt-1">Check back later for updates or adjust your filters.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {notifications.map((notification) => {
        const styles = getSeverityStyles(notification.type);
        return (
          <div
            key={notification.id}
            className={`relative flex items-start gap-4 p-4 md:p-5 rounded-xl border transition-all duration-300 ${styles.bg} ${
              !notification.read ? "shadow-sm border-l-4" : "opacity-85 border-slate-200 bg-white hover:bg-slate-50/50"
            }`}
          >
            {/* Unread Accent Bar */}
            {!notification.read && (
              <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${styles.accentBar}`} />
            )}

            {/* Icon Column */}
            <div className="flex-shrink-0 mt-0.5">
              {styles.icon}
            </div>

            {/* Content Column */}
            <div className="flex-grow min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-semibold text-slate-800 text-sm md:text-base leading-tight truncate">
                  {notification.title}
                </span>
                {notification.category && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200/50">
                    {notification.category}
                  </span>
                )}
                {!notification.read && (
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-600 animate-pulse ml-1" title="Unread" />
                )}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-3">
                {notification.message || notification.title}
              </p>
              <span className="text-xs text-slate-400 font-medium">
                {notification.time}
              </span>
            </div>

            {/* Actions Column */}
            <div className="flex items-center gap-2 flex-shrink-0 self-center">
              {!notification.read && (
                <button
                  onClick={() => onMarkRead(notification.id)}
                  className="flex items-center justify-center p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 transition-colors shadow-sm"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
              {notification.actionLink && (
                <button
                  onClick={() => handleActionClick(notification)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm"
                  title="Open reference link"
                >
                  <span>Open</span>
                  {notification.actionLink.startsWith("/mentor/discussion") ? (
                    <MessageSquare className="w-3.5 h-3.5" />
                  ) : (
                    <ExternalLink className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
