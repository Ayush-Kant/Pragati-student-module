import { useCallback, useEffect, useMemo, useState } from "react";
import { getAttendance, updateAttendance } from "../services/liveSessionService";
import { calculateAttendanceProgress } from "../utils/liveSessionHelpers";

/**
 * Tracks attendance status/history for a set of sessions.
 * Responsibilities: fetch attendance, mark attendance, compute progress.
 */
export function useAttendance(sessions = []) {
  const [attendanceMap, setAttendanceMap] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessions.length) return;
    let cancelled = false;

    async function loadAll() {
      setIsLoading(true);
      setError(null);
      const results = await Promise.all(
        sessions.map((s) => getAttendance(s.id))
      );
      if (cancelled) return;

      const nextMap = {};
      let firstError = null;
      results.forEach((res, i) => {
        if (res.success) {
          nextMap[sessions[i].id] = res.data.attendance;
        } else {
          firstError = firstError || res.error;
        }
      });
      setAttendanceMap(nextMap);
      setError(firstError);
      setIsLoading(false);
    }

    loadAll();
    return () => {
      cancelled = true;
    };
  }, [sessions]);

  const markAttendance = useCallback(async (sessionId, value) => {
    const result = await updateAttendance(sessionId, value);
    if (result.success) {
      setAttendanceMap((prev) => ({ ...prev, [sessionId]: value }));
    }
    return result;
  }, []);

  const attendanceHistory = useMemo(
    () =>
      sessions.map((s) => ({
        sessionId: s.id,
        title: s.title,
        date: s.date,
        status: attendanceMap[s.id] ?? s.attendance,
      })),
    [sessions, attendanceMap]
  );

  const progress = useMemo(
    () =>
      calculateAttendanceProgress(
        sessions.map((s) => ({ ...s, attendance: attendanceMap[s.id] ?? s.attendance }))
      ),
    [sessions, attendanceMap]
  );

  return { attendanceMap, attendanceHistory, progress, isLoading, error, markAttendance };
}
