import { useMemo } from "react";

export default function useDashboardStatistics(quickStats = {}) {
  return useMemo(() => {
    return {
      appliedDrives: quickStats?.appliedDrives ?? quickStats?.applicationsSubmitted ?? 0,
      shortlistedDrives: quickStats?.shortlistedDrives ?? quickStats?.shortlisted ?? 0,
      upcomingInterviews: quickStats?.upcomingInterviews ?? quickStats?.interviewsScheduled ?? 0,
      placementRate: quickStats?.placementRate ?? "0%",
      attendancePercentage: quickStats?.attendancePercentage ?? 0,
      xp: quickStats?.xp ?? 0,
    };
  }, [quickStats]);
}