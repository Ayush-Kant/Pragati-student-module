import {
  CalendarDays,
  ClipboardList,
  BarChart3,
  Building2,
  Award,
  Video,
  UserCheck,
  Megaphone,
  Bell,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { markNotificationRead } from "../../../../services/notification.service";

const notificationIcons = {
  session_scheduled: CalendarDays,
  assignment_published: ClipboardList,
  grade_released: Award,
  interview_invited: Video,
  interview_outcome: UserCheck,
  shortlisted: Building2,
  platform_announcement: Megaphone,
  certificate_issued: Award,
  quiz: BarChart3,
  drive: Building2,
  session: CalendarDays,
  assignment: ClipboardList,
  general: Bell,
};

const relativeTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const diff = Math.max(0, Date.now() - date.getTime());
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return days < 7
    ? `${days} day${days === 1 ? "" : "s"} ago`
    : date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};

const NotificationItem = ({ notification, onRead }) => {
  const navigate = useNavigate();
  const Icon = notificationIcons[notification.type] || Bell;
  const isRead = Boolean(notification.isRead ?? notification.read);

  const handleOpen = async () => {
    if (!isRead) {
      try {
        await markNotificationRead(notification.id);
        onRead?.(notification.id);
      } catch {
        // Keep navigation available even if the read acknowledgement fails.
      }
    }

    if (notification.linkUrl) {
      navigate(notification.linkUrl);
    }
  };

  return (
    <article
      className={`relative flex items-start justify-between gap-4 rounded-2xl border px-5 py-4 shadow-sm transition ${
        isRead
          ? "border-slate-200 bg-white"
          : "border-blue-100 bg-blue-50/70"
      }`}
    >
      <button
        type="button"
        onClick={handleOpen}
        className="flex min-w-0 flex-1 items-start gap-4 text-left"
      >
        <div
          className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            isRead
              ? "bg-slate-100 text-slate-500"
              : "bg-white text-blue-600 ring-1 ring-blue-100"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-slate-900">
              {notification.title}
            </h3>
            {!isRead && (
              <span
                className="h-2 w-2 shrink-0 rounded-full bg-blue-600"
                aria-label="Unread"
              />
            )}
          </div>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {notification.message || notification.body}
          </p>
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700">
            {notification.linkUrl ? "View details" : "View notification"}{" "}
            <ArrowRight size={13} />
          </span>
        </div>
      </button>
      <time
        dateTime={notification.createdAt}
        className="shrink-0 pt-1 text-xs text-slate-400"
      >
        {relativeTime(notification.createdAt)}
      </time>
    </article>
  );
};

export default NotificationItem;
