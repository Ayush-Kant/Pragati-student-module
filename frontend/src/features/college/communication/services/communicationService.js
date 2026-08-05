import api from "../../../../services/api";

/* =====================================
      ANNOUNCEMENTS
===================================== */

export const getAnnouncements = async () => {
  const { data } = await api.get("/college/communication/announcements");
  return data;
};

export const getAnnouncementById = async (id) => {
  const { data } = await api.get(`/college/communication/announcements/${id}`);
  return data;
};

export const createAnnouncement = async (announcementData) => {
  const { data } = await api.post(
    "/college/communication/announcements",
    announcementData
  );
  return data;
};

export const updateAnnouncement = async (
  id,
  announcementData
) => {
  const { data } = await api.put(
    `/college/communication/announcements/${id}`,
    announcementData
  );
  return data;
};

export const deleteAnnouncement = async (id) => {
  const { data } = await api.delete(
    `/college/communication/announcements/${id}`
  );
  return data;
};

export const publishAnnouncement = async (id) => {
  const { data } = await api.patch(
    `/college/communication/announcements/${id}/publish`
  );
  return data;
};

export const unpublishAnnouncement = async (id) => {
  const { data } = await api.patch(
    `/college/communication/announcements/${id}/unpublish`
  );
  return data;
};

/* =====================================
      NOTIFICATIONS
===================================== */

export const getNotifications = async () => {
  const { data } = await api.get("/college/communication/notifications");
  return data;
};

export const getNotificationHistory = async () => {
  const { data } = await api.get(
    "/college/communication/notifications/history"
  );
  return data;
};

export const sendNotification = async (
  notificationData
) => {
  const { data } = await api.post(
    "/college/communication/notifications",
    notificationData
  );
  return data;
};

export const updateNotification = async (
  id,
  notificationData
) => {
  const { data } = await api.put(
    `/college/communication/notifications/${id}`,
    notificationData
  );
  return data;
};

export const deleteNotification = async (id) => {
  const { data } = await api.delete(
    `/college/communication/notifications/${id}`
  );
  return data;
};

export const triggerNotification = async (id) => {
  const { data } = await api.post(
    `/college/communication/notifications/${id}/send`
  );
  return data;
};