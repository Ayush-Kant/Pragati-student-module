import * as announcementModel from "../models/collegeAnnouncements.model.js";

const formatAnnouncement = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  categoryId: row.category_id,
  categoryName: row.category_name || "General",
  status: row.status,
  priority: row.priority || "Medium",
  targetAudience: row.target_audience || "All Students",
  announcementType: row.announcement_type || "General",
  visibility: row.visibility || "Public",
  tags: row.tags || [],
  expiryDate: row.expiry_date,
  publishedDate: row.published_date,
  createdBy: row.created_by,
  creatorName: row.creator_name || "Admin",
  publishedBy: row.published_by,
  publisherName: row.publisher_name || null,
  attachmentUrl: row.attachment_url,
  imageUrl: row.image_url,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const getAnnouncements = async (queryParams) => {
  const { rows, meta } = await announcementModel.getAllAnnouncements(queryParams);
  return {
    data: rows.map(formatAnnouncement),
    meta,
  };
};

export const getAnnouncement = async (id) => {
  const announcement = await announcementModel.getAnnouncementById(id);
  if (!announcement) {
    const err = new Error(`Announcement with id ${id} not found.`);
    err.statusCode = 404;
    throw err;
  }
  return formatAnnouncement(announcement);
};

export const addAnnouncement = async (payload, userId) => {
  const createdBy = parseInt(userId || payload.created_by, 10);

  const created = await announcementModel.createAnnouncement({
    ...payload,
    title: payload.title?.trim(),
    description: payload.description?.trim(),
    created_by: isNaN(createdBy) ? 1 : createdBy,
  });
  return formatAnnouncement(created);
};

export const editAnnouncement = async (id, payload) => {
  const existing = await announcementModel.getAnnouncementById(id);
  if (!existing) {
    const err = new Error(`Announcement with id ${id} not found.`);
    err.statusCode = 404;
    throw err;
  }
  const updated = await announcementModel.updateAnnouncement(id, payload);
  return formatAnnouncement(updated);
};

export const removeAnnouncement = async (id) => {
  const existing = await announcementModel.getAnnouncementById(id);
  if (!existing) {
    const err = new Error(`Announcement with id ${id} not found.`);
    err.statusCode = 404;
    throw err;
  }
  await announcementModel.deleteAnnouncement(id);
  return { id: Number(id) };
};

export const publishAnnouncement = async (id, userId = null) => {
  const existing = await announcementModel.getAnnouncementById(id);
  if (!existing) {
    const err = new Error(`Announcement with id ${id} not found.`);
    err.statusCode = 404;
    throw err;
  }
  const published = await announcementModel.publishAnnouncement(id, userId);
  return formatAnnouncement(published);
};

export const unpublishAnnouncement = async (id) => {
  const existing = await announcementModel.getAnnouncementById(id);
  if (!existing) {
    const err = new Error(`Announcement with id ${id} not found.`);
    err.statusCode = 404;
    throw err;
  }
  const unpublished = await announcementModel.unpublishAnnouncement(id);
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