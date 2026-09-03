import api from "./api";

const normalizeResponse = (response) => response?.data ?? response;

export const NOTIFICATION_TYPES = [
  "grade_released",
  "session_scheduled",
  "assignment_published",
  "shortlisted",
  "interview_invited",
  "interview_outcome",
  "platform_announcement",
  "certificate_issued",
];

export const getNotifications = async ({ read = "all", page = 1, limit = 20 } = {}) => {
  const response = await api.get("/student/notifications", {
    params: { read, page, limit },
  });
  return normalizeResponse(response);
};

export const markNotificationsRead = async (notificationIds) => {
  const payload = notificationIds === "all" ? { notificationIds: "all" } : { notificationIds };
  const response = await api.patch("/student/notifications/read", payload);
  return normalizeResponse(response);
};

export const markNotificationRead = async (notificationId) =>
  markNotificationsRead([notificationId]);

export const markAllNotificationsRead = async () =>
  markNotificationsRead("all");

export const getNotificationPreferences = async () => {
  const response = await api.get("/student/notifications/preferences");
  return normalizeResponse(response);
};

export const updateNotificationPreferences = async (preferences) => {
  const response = await api.put("/student/notifications/preferences", { preferences });
  return normalizeResponse(response);
};

export const getPushPublicKey = async () => {
  const response = await api.get("/student/notifications/push/public-key");
  return normalizeResponse(response);
};

export const subscribeToPush = async (subscription) => {
  const response = await api.post("/student/notifications/push/subscribe", {
    subscription,
  });
  return normalizeResponse(response);
};

// Backwards-compatible name used by the notification preferences UI.
export const subscribePush = subscribeToPush;

export const unsubscribeFromPush = async (endpoint) => {
  const response = await api.delete("/student/notifications/push/subscribe", {
    data: { endpoint },
  });
  return normalizeResponse(response);
};

export const unsubscribePush = unsubscribeFromPush;

export default {
  getNotifications,
  markNotificationsRead,
  markNotificationRead,
  markAllNotificationsRead,
  getNotificationPreferences,
  updateNotificationPreferences,
  getPushPublicKey,
  subscribeToPush,
  subscribePush,
  unsubscribeFromPush,
  unsubscribePush,
};
