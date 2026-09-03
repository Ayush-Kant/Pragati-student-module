import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Bell, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getNotifications, markNotificationRead, markNotificationsRead } from "../../../../services/notification.service";

const formatRelativeTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const diff = Math.max(0, Date.now() - date.getTime());
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days < 7
    ? `${days}d ago`
    : date.toLocaleDateString(undefined, { day: "numeric", month: "short" });
};

const NotificationDropdown = ({ onUnreadCountChange, onClose }) => {
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getNotifications({ read: "all", page: 1, limit: 10 });
        const items = Array.isArray(data?.notifications) ? data.notifications : [];
        setNotifications(items);
        onUnreadCountChange?.(Number(data?.unreadCount || 0));

        // PRD behavior: opening the bell marks the displayed unread items as viewed.
        const unreadIds = items
          .filter((item) => !Boolean(item.isRead ?? item.read))
          .map((item) => item.id);

        if (unreadIds.length) {
          await markNotificationsRead(unreadIds);
          setNotifications((current) =>
            current.map((item) => ({ ...item, isRead: true, read: true })),
          );
          onUnreadCountChange?.((current) =>
            Math.max(0, Number(current || 0) - unreadIds.length),
          );
        }
      } catch {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [onUnreadCountChange]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!panelRef.current?.contains(event.target)) onClose?.();
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [onClose]);

  const openNotification = async (notification) => {
    try {
      if (!Boolean(notification.isRead ?? notification.read)) {
        await markNotificationRead(notification.id);
      }
    } finally {
      onClose?.();
      navigate(notification.linkUrl || "/student/notifications");
    }
  };

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-12 z-50 w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
          <p className="text-xs text-slate-500">Your latest 10 updates</p>
        </div>
        <button
          type="button"
          onClick={() => {
            onClose?.();
            navigate("/student/notifications");
          }}
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          View all <ArrowRight size={13} />
        </button>
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {loading ? (
          <div className="space-y-2 p-3">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <div className="mb-3 rounded-full bg-blue-50 p-3 text-blue-600">
              <Bell size={20} />
            </div>
            <p className="text-sm font-semibold text-slate-900">You're all caught up</p>
            <p className="mt-1 text-xs text-slate-500">New platform updates will appear here.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => openNotification(notification)}
              className="flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50"
            >
              <div
                className={`mt-0.5 rounded-lg p-2 ${
                  notification.isRead
                    ? "bg-slate-100 text-slate-500"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                {notification.isRead ? <CheckCircle2 size={15} /> : <Bell size={15} />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {notification.title}
                  </p>
                  {!notification.isRead && (
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                  )}
                </div>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">
                  {notification.message || notification.body}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  {formatRelativeTime(notification.createdAt)}
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
