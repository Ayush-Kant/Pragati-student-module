import { useEffect, useState, useCallback } from "react";
import {
  getPlacementDrives,
  createPlacementDrive,
  updatePlacementDrive,
  deletePlacementDrive,
} from "../services/placementDriveService";

const usePlacementDrives = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all drives
  const fetchDrives = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPlacementDrives();

      if (response.success) {
        setDrives(response.data);
      } else {
        setError("Failed to fetch placement drives.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Create drive
  const addDrive = async (drive) => {
    try {
      const response = await createPlacementDrive(drive);
      if (response.success && response.data) {
        setDrives((prev) => [response.data, ...prev]);
      }
      return response;
    } catch (err) {
      console.error("Error creating placement drive:", err);
      return { success: false, error: err.message };
    }
  };

  // Update drive
  const editDrive = async (id, updatedDrive) => {
    try {
      const response = await updatePlacementDrive(id, updatedDrive);

      if (response.success && response.data) {
        setDrives((prev) =>
          prev.map((drive) =>
            drive.id === id ? response.data : drive
          )
        );
      }
      return response;
    } catch (err) {
      console.error("Error updating placement drive:", err);
      return { success: false, error: err.message };
    }
  };

  // Delete drive
  const removeDrive = async (id) => {
    try {
      const response = await deletePlacementDrive(id);

      if (response.success) {
        setDrives((prev) =>
          prev.filter((drive) => drive.id !== id)
        );
      }
      return response;
    } catch (err) {
      console.error("Error deleting placement drive:", err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchDrives();
  }, [fetchDrives]);

  return {
    drives,
    loading,
    error,
    fetchDrives,
    addDrive,
    editDrive,
    removeDrive,
  };
};

export default usePlacementDrives;