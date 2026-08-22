import { useEffect, useState, useCallback } from "react";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  publishAnnouncement,
  unpublishAnnouncement,
} from "../services/communicationService";

export const useAnnouncements = (initialParams = {}) => {
  const [announcements, setAnnouncements] = useState([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [queryParams, setQueryParams] = useState(initialParams);

  const fetchAnnouncements = useCallback(
    async (params = queryParams) => {
      try {
        setLoading(true);
        setError(null);

        const response = await getAnnouncements(params);

        // F1 & F3: Extract nested payload structure and handle non-array fallbacks safely
        const payloadData = response?.data?.data || response?.data || response;
        const items = Array.isArray(payloadData)
          ? payloadData
          : Array.isArray(payloadData?.data)
          ? payloadData.data
          : [];

        const metadata = response?.data?.meta || payloadData?.meta || {
          page: 1,
          limit: 10,
          total: items.length,
          totalPages: 1,
        };

        setAnnouncements(items);
        setMeta(metadata);
      } catch (err) {
        setAnnouncements([]);
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            "Failed to fetch announcements."
        );
      } finally {
        setLoading(false);
      }
    },
    [queryParams]
  );

  useEffect(() => {
    fetchAnnouncements(queryParams);
  }, [queryParams, fetchAnnouncements]);

  const addAnnouncement = async (announcementData) => {
    try {
      setLoading(true);
      setError(null);
      await createAnnouncement(announcementData);
      await fetchAnnouncements();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to create announcement."
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editAnnouncement = async (id, announcementData) => {
    try {
      setLoading(true);
      setError(null);
      await updateAnnouncement(id, announcementData);
      await fetchAnnouncements();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to update announcement."
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeAnnouncement = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await deleteAnnouncement(id);
      await fetchAnnouncements();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to delete announcement."
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const publish = async (id) => {
    try {
      setError(null);
      await publishAnnouncement(id);
      await fetchAnnouncements();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to publish announcement."
      );
      throw err;
    }
  };

  const unpublish = async (id) => {
    try {
      setError(null);
      await unpublishAnnouncement(id);
      await fetchAnnouncements();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to unpublish announcement."
      );
      throw err;
    }
  };

  return {
    announcements,
    meta,
    loading,
    error,
    queryParams,
    setQueryParams,
    fetchAnnouncements,
    addAnnouncement,
    editAnnouncement,
    removeAnnouncement,
    publish,
    unpublish,
  };
};

export default useAnnouncements;