import * as announcementModel from "../models/collegeAnnouncements.model.js";

/**
 * Location:
 * backend/services/collegeAnnouncements.service.js
 */

const formatAnnouncement = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  categoryId: row.category_id,
  categoryName: row.category_name,
  status: row.status,
  createdBy: row.created_by,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const getAnnouncements = async () => {
  const rows = await announcementModel.getAllAnnouncements();

  return rows.map(formatAnnouncement);
};

export const getAnnouncement = async (id) => {
  const announcement =
    await announcementModel.getAnnouncementById(id);

  if (!announcement) {
    const err = new Error(
      `Announcement with id ${id} not found.`
    );
    err.statusCode = 404;
    throw err;
  }

  return formatAnnouncement(announcement);
};

export const addAnnouncement = async (payload) => {
  const created =
    await announcementModel.createAnnouncement({
      title: payload.title.trim(),
      description: payload.description.trim(),
      category_id: payload.category_id,
      created_by: payload.created_by,
    });

  return formatAnnouncement(created);
};

export const editAnnouncement = async (
  id,
  payload
) => {
  const existing =
    await announcementModel.getAnnouncementById(id);

  if (!existing) {
    const err = new Error(
      `Announcement with id ${id} not found.`
    );
    err.statusCode = 404;
    throw err;
  }

  const updated =
    await announcementModel.updateAnnouncement(
      id,
      payload
    );

  return formatAnnouncement(updated);
};

export const removeAnnouncement = async (
  id
) => {
  const existing =
    await announcementModel.getAnnouncementById(id);

  if (!existing) {
    const err = new Error(
      `Announcement with id ${id} not found.`
    );
    err.statusCode = 404;
    throw err;
  }

  await announcementModel.deleteAnnouncement(id);

  return {
    id: Number(id),
    message:
      "Announcement deleted successfully.",
  };
};

export const publishAnnouncement =
  async (id) => {
    const existing =
      await announcementModel.getAnnouncementById(
        id
      );

    if (!existing) {
      const err = new Error(
        `Announcement with id ${id} not found.`
      );
      err.statusCode = 404;
      throw err;
    }

    const published =
      await announcementModel.publishAnnouncement(
        id
      );

    return formatAnnouncement(published);
  };

export const unpublishAnnouncement =
  async (id) => {
    const existing =
      await announcementModel.getAnnouncementById(
        id
      );

    if (!existing) {
      const err = new Error(
        `Announcement with id ${id} not found.`
      );
      err.statusCode = 404;
      throw err;
    }

    const unpublished =
      await announcementModel.unpublishAnnouncement(
        id
      );

    return formatAnnouncement(unpublished);
  };

export default {
  getAnnouncements,
  getAnnouncement,
  addAnnouncement,
  editAnnouncement,
  removeAnnouncement,
  publishAnnouncement,
  unpublishAnnouncement,
};