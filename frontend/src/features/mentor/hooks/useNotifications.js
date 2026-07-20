import { useState, useEffect, useMemo } from "react";
import { communicationService } from "../services/communicationService";

export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All"); // 'All', 'Unread', 'Read'

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await communicationService.getNotifications();
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (filter === "Unread") {
      return notifications.filter((n) => !n.read);
    }
    if (filter === "Read") {
      return notifications.filter((n) => n.read);
    }
    return notifications;
  }, [notifications, filter]);

  const markAsRead = async (id) => {
    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      // In a real application, you'd call an API like POST /api/v1/notifications/:id/read
      // For now we just call local state updates as backend integration helper.
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const sendNotification = async (notificationData) => {
    try {
      const newNotification = await communicationService.sendNotification(notificationData);
      setNotifications((prev) => [newNotification, ...prev]);
      return { success: true, notification: newNotification };
    } catch (err) {
      console.error("Failed to send notification", err);
      return { success: false, error: err.message };
    }
  };

  return {
    notifications: filteredNotifications,
    rawNotifications: notifications,
    loading,
    error,
    filter,
    setFilter,
    unreadCount,
    markAsRead,
    markAllAsRead,
    sendNotification,
    refresh: fetchNotifications
  };
}
