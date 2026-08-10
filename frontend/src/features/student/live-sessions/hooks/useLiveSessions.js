// useLiveSessions.js
// Fetches live sessions and exposes filter/sort state for the listing UI

import { useState, useEffect, useCallback, useMemo } from "react";
import { getLiveSessions } from "../services/liveSessionsService";
import { LOADING_STATES } from "../constants/liveSessionsConstants";
import { filterSessionsByStatus, sortSessionsByStartTime } from "../utils/liveSessionsHelpers";
import { validateSession } from "../validations/liveSessionsValidation";

const useLiveSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loadingState, setLoadingState] = useState(LOADING_STATES.IDLE);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchSessions = useCallback(async () => {
    setLoadingState(LOADING_STATES.LOADING);
    setError(null);
    try {
      const data = await getLiveSessions();

      const validSessions = data.filter((session) => {
        const { valid, errors } = validateSession(session);
        if (!valid) {
          console.warn(`Invalid session data (id: ${session?.id ?? "unknown"}):`, errors);
        }
        return valid;
      });

      setSessions(validSessions);
      setLoadingState(LOADING_STATES.SUCCESS);
    } catch (err) {
      setError(err.message || "Failed to load live sessions");
      setLoadingState(LOADING_STATES.ERROR);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const filteredSessions = useMemo(
    () => sortSessionsByStartTime(filterSessionsByStatus(sessions, statusFilter)),
    [sessions, statusFilter]
  );

  const upcomingSessions = useMemo(
    () => sortSessionsByStartTime(sessions.filter((s) => s.status === "Upcoming" || s.status === "Live")),
    [sessions]
  );

  return {
    sessions: filteredSessions,
    allSessions: sessions,
    upcomingSessions,
    statusFilter,
    setStatusFilter,
    loading: loadingState === LOADING_STATES.LOADING,
    loadingState,
    error,
    refetch: fetchSessions,
  };
};

export default useLiveSessions;
