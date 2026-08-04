import { useMemo } from "react";

/**
 * Custom hook to filter, normalize, and categorize dashboard activities & pending tasks.
 * @param {Array|Object} sessionsOrActivities - List of sessions or combined activities.
 * @param {Array} [tasks=[]] - Optional separate list of pending tasks/assignments.
 * @returns {Object} Object containing sanitized upcomingSessions, pendingTasks, and counts.
 */
export default function useActivities(sessionsOrActivities = [], tasks = []) {
  return useMemo(() => {
    let sessionsList = [];
    let tasksList = [];

    // Case 1: Input is a single combined array (e.g., data.upcomingActivities = [...])
    if (Array.isArray(sessionsOrActivities) && tasks.length === 0) {
      sessionsList = sessionsOrActivities.filter(
        (item) =>
          item.type === "Session" ||
          item.type === "Workshop" ||
          item.type === "Interview" ||
          item.type === "Review" ||
          item.mentor ||
          item.speaker
      );

      tasksList = sessionsOrActivities.filter(
        (item) =>
          item.type === "Assignment" ||
          item.type === "Task" ||
          item.dueDate ||
          item.status === "in_progress"
      );
    } 
    // Case 2: Input is a nested object (e.g., data.upcomingActivities = { sessions: [...], tasks: [...] })
    else if (
      sessionsOrActivities &&
      typeof sessionsOrActivities === "object" &&
      !Array.isArray(sessionsOrActivities)
    ) {
      sessionsList = Array.isArray(sessionsOrActivities.sessions)
        ? sessionsOrActivities.sessions
        : [];
      tasksList = Array.isArray(sessionsOrActivities.tasks)
        ? sessionsOrActivities.tasks
        : [];
    } 
    // Case 3: Inputs are passed as separate arrays (sessions, tasks)
    else {
      sessionsList = Array.isArray(sessionsOrActivities) ? sessionsOrActivities : [];
      tasksList = Array.isArray(tasks) ? tasks : [];
    }

    return {
      upcomingSessions: sessionsList,
      pendingTasks: tasksList,
      totalSessionsCount: sessionsList.length,
      totalTasksCount: tasksList.length,
      hasPendingActivities: sessionsList.length > 0 || tasksList.length > 0,
    };
  }, [sessionsOrActivities, tasks]);
}