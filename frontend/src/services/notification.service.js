import api from './api';

const normalizeResponse = (response) => response?.data ?? response;

export const getNotifications = async ({ read = 'all', page = 1, limit = 20 } = {}) => {
  const response = await api.get('/student/notifications', {
    params: { read, page, limit },
  });
  return normalizeResponse(response);
};

export const markNotificationRead = async (notificationId) => {
  const response = await api.patch(`/student/notifications/${notificationId}/read`);
  return normalizeResponse(response);
};

export const markAllNotificationsRead = async () => {
  const response = await api.patch('/student/notifications/mark-all-read');
  return normalizeResponse(response);
};

export const getNotificationPreferences = async () => {
  const response = await api.get('/student/notifications/preferences');
  return normalizeResponse(response);
};

export const updateNotificationPreferences = async (preferences) => {
  const response = await api.put('/student/notifications/preferences', { preferences });
  return normalizeResponse(response);
};

export const getPushPublicKey = async () => {
  const response = await api.get('/student/notifications/push/public-key');
  return normalizeResponse(response);
};

export const subscribeToPush = async (subscription) => {
  const response = await api.post('/student/notifications/push/subscribe', {
    subscription,
  });
  return normalizeResponse(response);
};

export const unsubscribeFromPush = async (endpoint) => {
  const response = await api.delete('/student/notifications/push/subscribe', {
    data: { endpoint },
  });
  return normalizeResponse(response);
};

export default {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getNotificationPreferences,
  updateNotificationPreferences,
  getPushPublicKey,
  subscribeToPush,
  unsubscribeFromPush,
};
