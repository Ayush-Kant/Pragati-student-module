import { useEffect, useState } from "react";
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
  const fetchDrives = async () => {
    try {
      setLoading(true);

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
  };

  // Create drive
  const addDrive = async (drive) => {
    const response = await createPlacementDrive(drive);

    if (response.success) {
      setDrives((prev) => [...prev, response.data]);
    }

    return response;
  };

  // Update drive
  const editDrive = async (id, updatedDrive) => {
    const response = await updatePlacementDrive(id, updatedDrive);

    if (response.success) {
      setDrives((prev) =>
        prev.map((drive) =>
          drive.id === id ? response.data : drive
        )
      );
    }

    return response;
  };

  // Delete drive
  const removeDrive = async (id) => {
    const response = await deletePlacementDrive(id);

    if (response.success) {
      setDrives((prev) =>
        prev.filter((drive) => drive.id !== id)
      );
    }

    return response;
  };

  useEffect(() => {
    fetchDrives();
  }, []);

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