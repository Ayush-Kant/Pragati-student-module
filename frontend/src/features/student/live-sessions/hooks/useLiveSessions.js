import { useCallback, useEffect, useState } from "react";
import {
  getLiveSessions,
  joinSession as joinSessionApi,
  leaveSession as leaveSessionApi,
} from "../services/liveSessionService";
import { splitUpcomingAndPast } from "../utils/liveSessionHelpers";

/**
 * Fetches and manages the list of live sessions.
 * Responsibilities: fetch session data, join, leave, loading/error state.
 */
export function useLiveSessions() {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionState, setActionState] = useState({ id: null, type: null });

  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await getLiveSessions();
    if (result.success) {
      setSessions(result.data);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const joinSession = useCallback(async (sessionId) => {
    setActionState({ id: sessionId, type: "join" });
    const result = await joinSessionApi(sessionId);
    if (result.success) {
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, status: "Ongoing" } : s))
      );
    }
    setActionState({ id: null, type: null });
    return result;
  }, []);

  const leaveSession = useCallback(async (sessionId) => {
    setActionState({ id: sessionId, type: "leave" });
    const result = await leaveSessionApi(sessionId);
    setActionState({ id: null, type: null });
    return result;
  }, []);

  const { upcoming, past } = splitUpcomingAndPast(sessions);

  return {
    sessions,
    upcomingSessions: upcoming,
    pastSessions: past,
    isLoading,
    error,
    refetch: fetchSessions,
    joinSession,
    leaveSession,
    isJoining: (id) => actionState.id === id && actionState.type === "join",
    isLeaving: (id) => actionState.id === id && actionState.type === "leave",
  };
}
