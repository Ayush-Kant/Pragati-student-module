import { useState, useEffect, useCallback } from "react";
import { getDashboardData } from "../services/dashboardService";
import { LOADING_STATES } from "../constants/dashboardConstants";

// ── Demo student ID — replace with auth context later ─
const DEMO_STUDENT_ID = "demo-student-01";

const useDashboardData = (studentId = DEMO_STUDENT_ID) => {
  const [activeDrive,         setActiveDrive]         = useState(null);
  const [quickStats,          setQuickStats]          = useState(null);
  const [progressRing,        setProgressRing]        = useState(null);
  const [upcomingSessions,    setUpcomingSessions]    = useState([]);
  const [pendingTasks,        setPendingTasks]        = useState([]);
  const [leaderboard,         setLeaderboard]         = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);

  const [loadingState, setLoadingState] = useState(LOADING_STATES.IDLE);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setLoadingState(LOADING_STATES.LOADING);
    setError(null);
    try {
      const data = await getDashboardData(studentId);

      // 1. Map Active Drive / Student Info
      setActiveDrive(data?.student || data?.activeDrive || null);

      // 2. Map Quick Stats with robust default fallbacks
      const rawStats = data?.statistics || data?.quickStats || {};
      setQuickStats({
        applicationsSubmitted: rawStats.applicationsSubmitted ?? rawStats.applications ?? 0,
        interviewsScheduled: rawStats.interviewsScheduled ?? rawStats.interviews ?? 0,
        offersReceived: rawStats.offersReceived ?? rawStats.offers ?? 0,
        profileCompletion: rawStats.profileCompletion ?? rawStats.completion ?? 0,
      });

      // 3. Map Progress Metrics
      const rawProgress = data?.progress || data?.progressRing || {};
      setProgressRing({
        courseProgress: rawProgress.courseProgress ?? rawProgress.completionRate ?? 0,
        attendanceRate: rawProgress.attendanceRate ?? rawProgress.attendance ?? 0,
        totalXp: rawProgress.totalXp ?? rawProgress.xp ?? 0,
      });

      // 4. Map Schedules & Tasks (Checks nested & flat structures)
      setUpcomingSessions(
        data?.upcomingActivities?.sessions || data?.upcomingSessions || data?.sessions || []
      );
      
      setPendingTasks(
        data?.upcomingActivities?.tasks || data?.pendingTasks || data?.tasks || []
      );

      // 5. Map Achievements & Leaderboard
      setLeaderboard(
        data?.achievements?.leaderboard || data?.leaderboard || []
      );

      // 6. Map Notifications
      setRecentNotifications(
        data?.notifications || data?.recentNotifications || []
      );

      setLoadingState(LOADING_STATES.SUCCESS);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
      setLoadingState(LOADING_STATES.ERROR);
    }
  }, [studentId]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    // Data
    activeDrive,
    quickStats,
    progressRing,
    upcomingSessions,
    pendingTasks,
    leaderboard,
    recentNotifications,

    // States
    loading: loadingState === LOADING_STATES.LOADING,
    loadingState,
    error,

    // Actions
    refetch: fetchDashboard,
  };
};

export default useDashboardData;