import { useState, useEffect, useMemo } from "react";


// Mock Data for the UI task
const mockNotificationsData = [
  { 
    id: "m1", 
    type: "request", 
    message: "New Mentee Request: Aakash Sharma.", 
    timeAgo: "5m ago",
    read: false
  },
  { 
    id: "m2", 
    type: "success", 
    message: "Priya Jha submitted UI/UX Project.", 
    timeAgo: "1h ago",
    read: false
  },
  { 
    id: "m3", 
    type: "alert", 
    message: "Important System Notice: Platform maintenance scheduled.", 
    timeAgo: "2h ago",
    read: false
  },
  { 
    id: "m2", 
    type: "success", 
    message: "Animesh submitted FullStack Project.", 
    timeAgo: "3h ago",
    read: false
  }
];

export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");

  const fetchNotifications = async () => {
    // ACCEPTANCE CRITERIA: Token missing → redirects to /login
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return; 
    }

    try {
      setLoading(true);
      
      // Standard way: Use your teammate's service once the API is ready
      // const data = await communicationService.getNotifications();
      
      // Task way: Simulate network request with mock data
      await new Promise((resolve) => setTimeout(resolve, 800)); // Fake delay for skeleton loader
      setNotifications(mockNotificationsData);
      setError(null);

    } catch (err) {
      // ACCEPTANCE CRITERIA: 401 response from API → redirects to /login
      if (err?.response?.status === 401 || err?.status === 401) {
        window.location.href = "/login";
        return;
      }
      
      // ACCEPTANCE CRITERIA: Error banner shown if API call fails
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
    if (filter === "Unread") return notifications.filter((n) => !n.read);
    if (filter === "Read") return notifications.filter((n) => n.read);
    return notifications;
  }, [notifications, filter]);

  const markAsRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const sendNotification = async (notificationData) => {
    const newNotification = {
      id: Date.now().toString(),
      type: "info",
      message: notificationData.message || "New notification",
      timeAgo: "Just now",
      read: false
    };
    setNotifications((prev) => [newNotification, ...prev]);
    return { success: true, notification: newNotification };
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