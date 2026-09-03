import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, CheckCheck, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import NotificationItem from "../../components/notifications/NotificationItem";
import EmptyState from "../../components/common/EmptyState";
import StudentPageShell from "../../components/common/StudentPageShell";
import StudentPageHeader from "../../components/common/StudentPageHeader";
import { getNotifications, markNotificationsRead } from "../../../../services/notification.service";

const TYPE_LABELS = {
  grade_released: "Grades",
  session_scheduled: "Sessions",
  assignment_published: "Assignments",
  shortlisted: "Shortlisting",
  interview_invited: "Interviews",
  interview_outcome: "Interviews",
  platform_announcement: "Announcements",
  certificate_issued: "Certificates",
};

export default function NotificationsCenterPage() {
  const [readFilter, setReadFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [data, setData] = useState({
    notifications: [],
    unreadCount: 0,
    pagination: { total: 0, totalPages: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getNotifications({ read: readFilter, page, limit: 20 });
      setData(result || {
        notifications: [],
        unreadCount: 0,
        pagination: { total: 0, totalPages: 0 },
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load notifications.",
      );
    } finally {
      setLoading(false);
    }
  }, [page, readFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const filteredNotifications = useMemo(() => {
    if (typeFilter === "all") return data.notifications || [];
    return (data.notifications || []).filter(
      (item) => TYPE_LABELS[item.type] === typeFilter,
    );
  }, [data.notifications, typeFilter]);

  const typeOptions = useMemo(
    () => [
      "all",
      ...new Set(
        (data.notifications || [])
          .map((item) => TYPE_LABELS[item.type])
          .filter(Boolean),
      ),
    ],
    [data.notifications],
  );

  const handleMarkAll = async () => {
    try {
      await markNotificationsRead("all");
      await load();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to mark notifications as read.",
      );
    }
  };

  const handleRead = (notificationId) => {
    setData((current) => {
      const notification = current.notifications.find(
        (item) => item.id === notificationId,
      );
      if (!notification || Boolean(notification.isRead ?? notification.read)) {
        return current;
      }

      return {
        ...current,
        unreadCount: Math.max(0, Number(current.unreadCount || 0) - 1),
        notifications: current.notifications.map((item) =>
          item.id === notificationId
            ? { ...item, isRead: true, read: true }
            : item,
        ),
      };
    });
  };

  return (
    <StudentPageShell>
      <StudentPageHeader
        title="Notifications"
        subtitle="Stay up to date with grades, sessions, assignments, interviews and platform updates."
      />

      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Filter size={14} /> Filter
          </span>
          {["all", "false", "true"].map((value) => {
            const label = value === "all" ? "All" : value === "false" ? "Unread" : "Read";
            return (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setReadFilter(value);
                  setPage(1);
                }}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                  readFilter === value
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {label}
                {value === "all" ? ` (${data.pagination?.total || 0})` : ""}
              </button>
            );
          })}
          <span className="hidden h-5 w-px bg-slate-200 sm:block" />
          {typeOptions.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTypeFilter(type)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                typeFilter === type
                  ? "border-violet-600 bg-violet-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              {type === "all" ? "All types" : type}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 xl:justify-end">
          <span className="text-sm text-slate-500">
            <strong className="text-slate-900">{data.unreadCount || 0}</strong> unread
          </span>
          <button
            type="button"
            onClick={handleMarkAll}
            disabled={!data.unreadCount || loading}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
          >
            <CheckCheck size={15} /> Mark all as read
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      ) : filteredNotifications.length === 0 ? (
        <EmptyState
          title="No notifications"
          description="You're all caught up for the current filter."
          icon={<Bell size={28} />}
        />
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRead={handleRead}
            />
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <p className="text-xs text-slate-500">
          Page {data.pagination?.page || page} of {Math.max(1, data.pagination?.totalPages || 1)}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={page <= 1 || loading}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={14} /> Previous
          </button>
          <button
            type="button"
            onClick={() => setPage((value) => value + 1)}
            disabled={loading || page >= (data.pagination?.totalPages || 1)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </StudentPageShell>
  );
}
