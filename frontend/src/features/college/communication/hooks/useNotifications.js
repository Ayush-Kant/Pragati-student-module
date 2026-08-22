import { useEffect, useState, useCallback } from "react";
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

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getNotifications();
      const items = response?.data?.data || response?.data || response;
      setNotifications(Array.isArray(items) ? items : []);
    } catch (err) {
      setNotifications([]);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to fetch notifications."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNotificationHistory = useCallback(async () => {
    try {
      const response = await getNotificationHistory();
      const items = response?.data?.data || response?.data || response;
      setHistory(Array.isArray(items) ? items : []);
    } catch (err) {
      setHistory([]);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to fetch notification history."
      );
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    fetchNotificationHistory();
  }, [fetchNotifications, fetchNotificationHistory]);

  const create = async (notificationData) => {
    try {
      setLoading(true);
      setError(null);
      await sendNotification(notificationData);
      await fetchNotifications();
      await fetchNotificationHistory();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to send notification."
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id, notificationData) => {
    try {
      setLoading(true);
      setError(null);
      await updateNotification(id, notificationData);
      await fetchNotifications();
      await fetchNotificationHistory();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to update notification."
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await deleteNotification(id);
      await fetchNotifications();
      await fetchNotificationHistory();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to delete notification."
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const send = async (id) => {
    try {
      setError(null);
      await triggerNotification(id);
      await fetchNotifications();
      await fetchNotificationHistory();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to send notification."
      );
      throw err;
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

export default useNotifications;