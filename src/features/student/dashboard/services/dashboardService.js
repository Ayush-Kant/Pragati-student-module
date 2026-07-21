import { dashboardData } from '../types/dashboardDummyData';
import { API_CONFIG } from '../constants/dashboardConstants';

/**
 * Simulates an API network request with latency controlled by constants.
 * In a real implementation, swapping these helpers with `fetch` or `axios` 
 * using API_CONFIG.BASE_URL will complete the backend wiring.
 */
const mockFetch = (endpoint, data) => {
  // Logging the request endpoint helps verify the configuration-driven URL routing
  console.log(`[Service Request] GET -> ${API_CONFIG.BASE_URL}${endpoint}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: JSON.parse(JSON.stringify(data)) // Return a deep copy to prevent direct state mutation
      });
    }, API_CONFIG.MOCK_DELAY_MS);
  });
};

export const getDashboard = () => {
  return mockFetch('/dashboard', dashboardData);
};

export const getDashboardStatistics = () => {
  return mockFetch('/dashboard/statistics', dashboardData.statistics);
};

export const getLearningProgress = () => {
  return mockFetch('/dashboard/progress', {
    courseProgress: dashboardData.progress.courseProgress,
    moduleProgress: dashboardData.progress.moduleProgress,
    xp: dashboardData.progress.xp,
    attendance: dashboardData.attendance
  });
};

export const getUpcomingActivities = () => {
  return mockFetch('/dashboard/activities/upcoming', dashboardData.upcomingActivities);
};

export const getRecentActivities = () => {
  return mockFetch('/dashboard/activities/recent', dashboardData.recentActivities);
};

export const getPerformanceSummary = () => {
  return mockFetch('/dashboard/performance', dashboardData.performance);
};

export const getNotifications = () => {
  return mockFetch('/dashboard/notifications', dashboardData.notifications);
};

export const markNotificationAsRead = (id) => {
  const notification = dashboardData.notifications.find(n => n.id === id);
  if (notification) {
    notification.isRead = true;
  }
  return mockFetch(`/dashboard/notifications/${id}/read`, dashboardData.notifications);
};

export const markAllNotificationsAsRead = () => {
  dashboardData.notifications.forEach(n => {
    n.isRead = true;
  });
  return mockFetch('/dashboard/notifications/read-all', dashboardData.notifications);
};
