import { useState, useEffect, useCallback } from "react";
import { adminService } from "../services/adminService";

const useTrainingPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ------------------------------
      Fetch Programs
  ------------------------------ */

  const fetchPrograms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminService.getTrainingPrograms();

      setPrograms(response.courses || []);
    } catch (err) {
      console.error("Failed to fetch training programs:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  /* ------------------------------
      Create Program
  ------------------------------ */

  const createProgram = async (payload) => {
    try {
      await adminService.createTrainingProgram(payload);
      await fetchPrograms();
    } catch (err) {
      console.error("Failed to create program:", err);
      throw err;
    }
  };

  /* ------------------------------
      Update Program
  ------------------------------ */

  const updateProgram = async (programId, payload) => {
    try {
      await adminService.updateTrainingProgram(programId, payload);
      await fetchPrograms();
    } catch (err) {
      console.error("Failed to update program:", err);
      throw err;
    }
  };

  /* ------------------------------
      Archive Program
  ------------------------------ */

  const archiveProgram = async (programId) => {
    try {
      await adminService.archiveTrainingProgram(programId);
      await fetchPrograms();
    } catch (err) {
      console.error("Failed to archive program:", err);
      throw err;
    }
  };

  /* ------------------------------
      Return Hook
  ------------------------------ */

  return {
    programs,
    loading,
    error,
    createProgram,
    updateProgram,
    archiveProgram,
    refetch: fetchPrograms,
  };
};

export default useTrainingPrograms;
