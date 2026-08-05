import { useMemo } from "react";

/**
 * Custom hook to extract and normalize dashboard statistics metrics.
 * @param {Object} quickStats - The raw statistics object from the API or dashboard data hook.
 * @returns {Object} Normalized statistics object with robust fallbacks.
 */
export default function useDashboardStatistics(quickStats = {}) {
  return useMemo(() => {
    const raw = quickStats || {};

    return {
      appliedDrives:
        raw.appliedDrives ??
        raw.applicationsSubmitted ??
        raw.applications ??
        0,

      shortlistedDrives:
        raw.shortlistedDrives ??
        raw.shortlisted ??
        raw.offersReceived ??
        0,

      upcomingInterviews:
        raw.upcomingInterviews ??
        raw.interviewsScheduled ??
        raw.interviews ??
        0,

      placementRate:
        raw.placementRate ??
        (raw.placementPercentage ? `${raw.placementPercentage}%` : "0%"),

      attendancePercentage:
        raw.attendancePercentage ??
        raw.attendanceRate ??
        raw.attendance ??
        raw.profileCompletion ??
        0,

      xp:
        raw.xp ??
        raw.totalXp ??
        raw.points ??
        0,

      studentName:
        raw.studentName ||
        "Student",
    };
  }, [quickStats]);
}