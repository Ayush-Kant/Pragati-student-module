import * as service from "../services/collegeAnnouncements.service.js";

/**
 * Location:
 * backend/controllers/collegeAnnouncements.controller.js
 */

export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await service.getAnnouncements();
    res.status(200).json(announcements);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
};

export const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await service.getAnnouncement(req.params.id);
    res.status(200).json(announcement);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const announcement = await service.addAnnouncement(req.body);

    res.status(201).json({
      message: "Announcement created successfully.",
      announcement,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await service.editAnnouncement(
      req.params.id,
      req.body
    );

    res.status(200).json({
      message: "Announcement updated successfully.",
      announcement,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const result = await service.removeAnnouncement(req.params.id);

    res.status(200).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
};

export const publishAnnouncement = async (req, res) => {
  try {
    const announcement = await service.publishAnnouncement(req.params.id);

    res.status(200).json({
      message: "Announcement published successfully.",
      announcement,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
};

export const unpublishAnnouncement = async (req, res) => {
  try {
    const announcement = await service.unpublishAnnouncement(req.params.id);

    res.status(200).json({
      message: "Announcement unpublished successfully.",
      announcement,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
};

export default {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  publishAnnouncement,
  unpublishAnnouncement,
};