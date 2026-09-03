import api from '../../../services/api';

const unwrap = (response) => response?.data ?? response;

export const getNotifications = async ({ read = 'all', page = 1, limit = 20 } = {}) => {
  const response = await api.get('/student/notifications', {
    params: { read, page, limit },
  });
  return unwrap(response);
};

export const markNotificationsRead = async (notificationIds) => {
  const response = await api.patch('/student/notifications/read', {
    notificationIds,
  });
  return unwrap(response);
};

export const markNotificationRead = async (notificationId) => {
  const response = await api.patch(`/student/notifications/${notificationId}/read`);
  return unwrap(response);
};

export const getNotificationPreferences = async () => {
  const response = await api.get('/student/notifications/preferences');
  return unwrap(response);
};

export const updateNotificationPreferences = async (preferences) => {
  const response = await api.put('/student/notifications/preferences', { preferences });
  return unwrap(response);
};

export const getPushPublicKey = async () => {
  const response = await api.get('/student/notifications/push/public-key');
  return unwrap(response);
};

export const subscribePush = async (subscription) => {
  const response = await api.post('/student/notifications/push/subscribe', { subscription });
  return unwrap(response);
};

export const unsubscribePush = async (endpoint) => {
  const response = await api.delete('/student/notifications/push/subscribe', {
    data: { endpoint },
  });
  return unwrap(response);
};
