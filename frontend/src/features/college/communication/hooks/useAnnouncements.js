import { useEffect, useState } from "react";

import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  publishAnnouncement,
  unpublishAnnouncement,
} from "../services/communicationService";

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAnnouncements();

      setAnnouncements(response.data || response);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to fetch announcements."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const addAnnouncement = async (announcementData) => {
    try {
      setLoading(true);

      await createAnnouncement(announcementData);

      await fetchAnnouncements();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to create announcement."
      );
    } finally {
      setLoading(false);
    }
  };

  const editAnnouncement = async (id, announcementData) => {
    try {
      setLoading(true);

      await updateAnnouncement(id, announcementData);

      await fetchAnnouncements();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to update announcement."
      );
    } finally {
      setLoading(false);
    }
  };

  const removeAnnouncement = async (id) => {
    try {
      setLoading(true);

      await deleteAnnouncement(id);

      await fetchAnnouncements();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to delete announcement."
      );
    } finally {
      setLoading(false);
    }
  };

  const publish = async (id) => {
    try {
      await publishAnnouncement(id);
      await fetchAnnouncements();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to publish announcement."
      );
    }
  };

  const unpublish = async (id) => {
    try {
      await unpublishAnnouncement(id);
      await fetchAnnouncements();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to unpublish announcement."
      );
    }
  };

  return {
    announcements,
    loading,
    error,

    fetchAnnouncements,

    addAnnouncement,
    editAnnouncement,
    removeAnnouncement,

    publish,
    unpublish,
  };
};