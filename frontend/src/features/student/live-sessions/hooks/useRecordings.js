// useRecordings.js
// Fetches recording availability/URL for a specific session

import { useState, useEffect, useCallback } from "react";
import { getRecordings } from "../services/liveSessionsService";
import { LOADING_STATES } from "../constants/liveSessionsConstants";

const useRecordings = (sessionId) => {
  const [recording, setRecording] = useState(null);
  const [loadingState, setLoadingState] = useState(LOADING_STATES.IDLE);
  const [error, setError] = useState(null);

  const fetchRecording = useCallback(async () => {
    if (!sessionId) return;
    setLoadingState(LOADING_STATES.LOADING);
    setError(null);
    try {
      const data = await getRecordings(sessionId);
      setRecording(data);
      setLoadingState(LOADING_STATES.SUCCESS);
    } catch (err) {
      setError(err.message || "Failed to load recording");
      setLoadingState(LOADING_STATES.ERROR);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchRecording();
  }, [fetchRecording]);

  return {
    recording,
    loading: loadingState === LOADING_STATES.LOADING,
    loadingState,
    error,
    refetch: fetchRecording,
  };
};

export default useRecordings;
