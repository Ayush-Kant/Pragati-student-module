import { useMemo } from "react";

export default function useActivities(sessions = [], tasks = []) {
  return useMemo(() => {
    return {
      upcomingSessions: Array.isArray(sessions) ? sessions : [],
      pendingTasks: Array.isArray(tasks) ? tasks : [],
    };
  }, [sessions, tasks]);
}