import * as service from "../services/collegeAnnouncements.service.js";
import announcementModel from "../models/collegeAnnouncements.model.js";

export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await service.getAnnouncements();
    res.status(200).json(announcements);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

export const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await service.getAnnouncement(req.params.id);
    res.status(200).json(announcement);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    // Fallback to req.user.id if attached by auth middleware, or convert payload created_by to integer
    const createdBy = parseInt(req.body.created_by || req.user?.id || 1, 10);

    if (isNaN(createdBy)) {
      return res.status(400).json({ error: "created_by must be a valid integer." });
    }

    const announcementData = {
      ...req.body,
      created_by: createdBy,
    };

    const newAnnouncement = await announcementModel.createAnnouncement(announcementData);
    res.status(201).json(newAnnouncement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      updated_by: req.user?.id,
    };
    const announcement = await service.editAnnouncement(req.params.id, payload);
    res.status(200).json({
      message: "Announcement updated successfully.",
      announcement,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const result = await service.removeAnnouncement(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

export const publishAnnouncement = async (req, res) => {
  try {
    const announcement = await service.publishAnnouncement(req.params.id, req.user?.id);
    res.status(200).json({
      message: "Announcement published successfully.",
      announcement,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
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
    res.status(err.statusCode || 500).json({ error: err.message });
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