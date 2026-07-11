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

      setActiveDrive(data.activeDrive);
      setQuickStats(data.quickStats);
      setProgressRing(data.progressRing);
      setUpcomingSessions(data.upcomingSessions);
      setPendingTasks(data.pendingTasks);
      setLeaderboard(data.leaderboard);
      setRecentNotifications(data.recentNotifications);

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
