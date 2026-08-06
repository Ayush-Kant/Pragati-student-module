import * as service from "../services/collegeAnnouncements.service.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await announcementModel.getAllCategories();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAnnouncements = async (req, res) => {
  try {
    const result = await service.getAnnouncements(req.query);
    res.status(200).json({
      success: true,
      message: "Announcements fetched",
      data: result,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed to fetch announcements",
      data: null,
    });
  }
};

export const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await service.getAnnouncement(req.params.id);
    res.status(200).json({
      success: true,
      message: "Announcement fetched successfully",
      data: announcement,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed to fetch announcement",
      data: null,
    });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const newAnnouncement = await service.addAnnouncement(req.body, req.user?.id);
    res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      data: newAnnouncement,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create announcement",
      data: null,
    });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await service.editAnnouncement(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Announcement updated successfully",
      data: announcement,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed to update announcement",
      data: null,
    });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const result = await service.removeAnnouncement(req.params.id);
    res.status(200).json({
      success: true,
      message: "Announcement deleted successfully",
      data: result,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed to delete announcement",
      data: null,
    });
  }
};

export const publishAnnouncement = async (req, res) => {
  try {
    const announcement = await service.publishAnnouncement(req.params.id, req.user?.id);
    res.status(200).json({
      success: true,
      message: "Announcement published successfully",
      data: announcement,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed to publish announcement",
      data: null,
    });
  }
};

export const unpublishAnnouncement = async (req, res) => {
  try {
    const announcement = await service.unpublishAnnouncement(req.params.id);
    res.status(200).json({
      success: true,
      message: "Announcement unpublished successfully",
      data: announcement,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed to unpublish announcement",
      data: null,
    });
  }
};

export default {
  getCategories,
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  publishAnnouncement,
  unpublishAnnouncement,
};