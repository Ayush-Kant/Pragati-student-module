import { useMemo } from "react";

export default function useNotifications(notificationsData = []) {
  return useMemo(() => {
    const list = Array.isArray(notificationsData) ? notificationsData : [];
    const unreadCount = list.filter((n) => n.status === "unread" || !n.read).length;

    return {
      notifications: list,
      unreadCount,
    };
  }, [notificationsData]);
}