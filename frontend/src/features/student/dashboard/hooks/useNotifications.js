import { useMemo } from "react";

/**
 * Custom hook to manage and format dashboard notifications.
 * @param {Array|Object} notificationsData - Array of notification items or payload object.
 * @returns {Object} Object containing sanitized notifications array, unread count, and status flags.
 */
export default function useNotifications(notificationsData = []) {
  return useMemo(() => {
    // Safely extract list if wrapped inside an object
    let list = [];
    if (Array.isArray(notificationsData)) {
      list = notificationsData;
    } else if (notificationsData && Array.isArray(notificationsData.notifications)) {
      list = notificationsData.notifications;
    } else if (notificationsData && Array.isArray(notificationsData.recentNotifications)) {
      list = notificationsData.recentNotifications;
    }

    // Count unread notifications across common schema conventions
    const unreadCount = list.filter((item) => {
      if (!item) return false;
      if (typeof item.read === "boolean") return !item.read;
      if (typeof item.isRead === "boolean") return !item.isRead;
      return item.status === "unread";
    }).length;

    return {
      notifications: list,
      unreadCount,
      hasUnread: unreadCount > 0,
      totalCount: list.length,
    };
  }, [notificationsData]);
}