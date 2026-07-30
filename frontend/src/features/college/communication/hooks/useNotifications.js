import { useEffect, useState } from "react";

import {
  getNotifications,
  getNotificationHistory,
  sendNotification,
  updateNotification,
  deleteNotification,
  triggerNotification,
} from "../services/communicationService";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getNotifications();
      setNotifications(response.data || response);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to fetch notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchNotificationHistory = async () => {
    try {
      const response = await getNotificationHistory();
      setHistory(response.data || response);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to fetch notification history."
      );
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchNotificationHistory();
  }, []);

  const create = async (notificationData) => {
    try {
      setLoading(true);

      await sendNotification(notificationData);
      await fetchNotifications();
      await fetchNotificationHistory();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to send notification."
      );
    } finally {
      setLoading(false);
    }
  };

  const update = async (id, notificationData) => {
    try {
      setLoading(true);

      await updateNotification(id, notificationData);
      await fetchNotifications();
      await fetchNotificationHistory();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to update notification."
      );
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    try {
      setLoading(true);

      await deleteNotification(id);
      await fetchNotifications();
      await fetchNotificationHistory();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to delete notification."
      );
    } finally {
      setLoading(false);
    }
  };

  const send = async (id) => {
    try {
      await triggerNotification(id);
      await fetchNotifications();
      await fetchNotificationHistory();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to send notification."
      );
    }
  };

  return {
    notifications,
    history,
    loading,
    error,

    fetchNotifications,
    fetchNotificationHistory,

    create,
    update,
    remove,
    send,
  };
};