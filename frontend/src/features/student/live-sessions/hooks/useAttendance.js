// useAttendance.js
// Fetches attendance status for a specific session

import { useState, useEffect, useCallback } from "react";
import { getAttendance } from "../services/liveSessionsService";
import { LOADING_STATES } from "../constants/liveSessionsConstants";
import { validateAttendanceStatus } from "../validations/liveSessionsValidation";

const useAttendance = (sessionId) => {
  const [attendance, setAttendance] = useState(null);
  const [loadingState, setLoadingState] = useState(LOADING_STATES.IDLE);
  const [error, setError] = useState(null);

  const fetchAttendance = useCallback(async () => {
    if (!sessionId) return;
    setLoadingState(LOADING_STATES.LOADING);
    setError(null);
    try {
      const data = await getAttendance(sessionId);

      const { valid, errors } = validateAttendanceStatus(data?.status);
      if (!valid) {
        console.warn(`Invalid attendance status (sessionId: ${sessionId}):`, errors);
      }

      setAttendance(data);
      setLoadingState(LOADING_STATES.SUCCESS);
    } catch (err) {
      setError(err.message || "Failed to load attendance");
      setLoadingState(LOADING_STATES.ERROR);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  return {
    attendance,
    loading: loadingState === LOADING_STATES.LOADING,
    loadingState,
    error,
    refetch: fetchAttendance,
  };
};

export default useAttendance;
