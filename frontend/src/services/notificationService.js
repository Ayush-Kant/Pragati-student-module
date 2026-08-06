import api from "./api";

const TYPE_MAP = {
  info: "general",
  success: "general",
  warning: "session",
  alert: "drive",
};

function getRelativeTime(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

function formatDate(dateString) {
  const d = new Date(dateString);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function mapNotification(n) {
  return {
    notificationId: `n-${String(n.id).padStart(3, "0")}`,
    title: n.title,
    message: n.message,
    type: TYPE_MAP[n.type] || "general",
    isRead: n.isRead,
    time: getRelativeTime(n.createdAt),
    createdAt: n.createdAt,
    linkUrl: n.linkUrl,
    date: formatDate(n.createdAt),
    status: n.isRead ? "read" : "unread",
  };
}

export async function fetchNotifications({ page = 1, limit = 20 } = {}) {
  const res = await api.get(`/v1/notifications?page=${page}&limit=${limit}`);
  const { data } = res.data;
  return {
    notifications: data.notifications.map(mapNotification),
    unreadCount: data.unreadCount,
    page: data.page,
    limit: data.limit,
    total: data.total,
  };
}

export async function fetchUnreadCount() {
  const res = await api.get("/v1/notifications?page=1&limit=1");
  return res.data.data.unreadCount;
}

export async function markAsRead({ notificationIds, markAll } = {}) {
  const res = await api.put("/v1/notifications/read", {
    ...(markAll ? { markAll: true } : { notificationIds }),
  });
  return res.data;
}

export async function markAllAsRead() {
  return markAsRead({ markAll: true });
}
