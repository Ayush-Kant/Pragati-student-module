import { useState, useEffect, useCallback } from "react";
import { adminService } from "../services/adminService";

const useTrainingProgramDetail = (programId) => {
  const [program, setProgram] = useState(null);

  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  /* =====================================
          Fetch Training Program
  ===================================== */

  const fetchProgram = useCallback(async () => {
    if (!programId) return;

    try {
      setLoading(true);
      setError(null);

      const [programData, analyticsData] = await Promise.all([
        adminService.getTrainingProgramById(programId),
        adminService.getTrainingAnalytics(programId),
      ]);

      setProgram(programData);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error("Failed to fetch training program:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [programId]);

  /* =====================================
          Initial Load
  ===================================== */

  useEffect(() => {
    fetchProgram();
  }, [fetchProgram]);

  /* =====================================
          Return
  ===================================== */

  return {
    program,
    analytics,
    loading,
    error,
    refetch: fetchProgram,
  };
};

export default useTrainingProgramDetail;