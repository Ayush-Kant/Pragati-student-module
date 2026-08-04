import api from "../../../../services/api";

/* =====================================
      ANNOUNCEMENTS
===================================== */

export const getAnnouncements = async (params = {}) => {
  const { data } = await api.get("/announcements", { params });
  return data;
};

export const getAnnouncementById = async (id) => {
  const { data } = await api.get(`/announcements/${id}`);
  return data;
};

export const createAnnouncement = async (announcementData) => {
  const { data } = await api.post(
    "/announcements",
    announcementData
  );
  return data;
};

export const updateAnnouncement = async (
  id,
  announcementData
) => {
  const { data } = await api.put(
    `/announcements/${id}`,
    announcementData
  );
  return data;
};

export const deleteAnnouncement = async (id) => {
  const { data } = await api.delete(
    `/announcements/${id}`
  );
  return data;
};

export const publishAnnouncement = async (id) => {
  const { data } = await api.patch(
    `/announcements/${id}/publish`
  );
  return data;
};

export const unpublishAnnouncement = async (id) => {
  const { data } = await api.patch(
    `/announcements/${id}/unpublish`
  );
  return data;
};

/* =====================================
      NOTIFICATIONS
===================================== */

export const getNotifications = async () => {
  const { data } = await api.get("/notifications");
  return data;
};

export const getNotificationHistory = async () => {
  const { data } = await api.get(
    "/notifications/history"
  );
  return data;
};

export const sendNotification = async (
  notificationData
) => {
  const { data } = await api.post(
    "/notifications",
    notificationData
  );
  return data;
};

export const updateNotification = async (
  id,
  notificationData
) => {
  const { data } = await api.put(
    `/notifications/${id}`,
    notificationData
  );
  return data;
};

export const deleteNotification = async (id) => {
  const { data } = await api.delete(
    `/notifications/${id}`
  );
  return data;
};

export const triggerNotification = async (id) => {
  const { data } = await api.post(
    `/notifications/${id}/send`
  );
  return data;
};