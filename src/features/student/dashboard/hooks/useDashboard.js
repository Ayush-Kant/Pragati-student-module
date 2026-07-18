import { useState, useEffect, useCallback } from 'react';
import { getDashboard, markNotificationAsRead, markAllNotificationsAsRead } from '../services/dashboardService';
import { validateDashboard } from '../validations/dashboardValidation';

export const useDashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getDashboard();
      if (response.success) {
        // Run data validation
        validateDashboard(response.data);
        setData(response.data);
      } else {
        throw new Error('Failed to retrieve dashboard statistics from service.');
      }
    } catch (err) {
      console.error('[useDashboard error]', err);
      setError(err.message || 'An unexpected error occurred while fetching dashboard data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id) => {
    // Optimistic update to UI state
    setData((prevData) => {
      if (!prevData) return prevData;
      const updatedNotifications = prevData.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      return {
        ...prevData,
        notifications: updatedNotifications
      };
    });

    try {
      await markNotificationAsRead(id);
    } catch (err) {
      console.error('[useDashboard markAsRead error]', err);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    // Optimistic update to UI state
    setData((prevData) => {
      if (!prevData) return prevData;
      const updatedNotifications = prevData.notifications.map((n) => ({
        ...n,
        isRead: true
      }));
      return {
        ...prevData,
        notifications: updatedNotifications
      };
    });

    try {
      await markAllNotificationsAsRead();
    } catch (err) {
      console.error('[useDashboard markAllRead error]', err);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchDashboardData,
    markAsRead,
    markAllRead
  };
};
