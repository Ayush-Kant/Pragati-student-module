import { useState, useEffect, useCallback } from "react";
import { getDashboardData } from "../services/dashboardService";
import { LOADING_STATES } from "../constants/dashboardConstants";
import { validateDashboardData } from "../validation/dashboardValidation";

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

      // Validate response structure using the dashboard validation module
      const validation = validateDashboardData(data);
      if (!validation.isValid) {
        throw new Error(validation.error || "Invalid dashboard API payload format.");
      }

      // 1. Map Active Placement Drive / Student Profile
      setActiveDrive(data?.activeDrive || data?.student || data?.currentDrive || null);

      // 2. Map Quick Stats with robust fallback chains matching StatisticsCards requirements
      const rawStats = data?.statistics || data?.quickStats || {};
      setQuickStats({
        appliedDrives: rawStats.appliedDrives ?? rawStats.applicationsSubmitted ?? rawStats.applications ?? 0,
        shortlistedDrives: rawStats.shortlistedDrives ?? rawStats.shortlisted ?? 0,
        upcomingInterviews: rawStats.upcomingInterviews ?? rawStats.interviewsScheduled ?? rawStats.interviews ?? 0,
        placementRate: rawStats.placementRate ?? "0%",
        attendancePercentage: rawStats.attendancePercentage ?? rawStats.attendance ?? 0,
        xp: rawStats.xp ?? rawStats.totalXp ?? rawStats.points ?? 0,
        studentName: data?.studentName || data?.student?.name || rawStats?.studentName || "Student",
      });

      // 3. Map Progress Metrics matching ProgressOverview requirements
      const rawProgress = data?.progress || data?.progressRing || {};
      setProgressRing({
        courseProgress: rawProgress.courseProgress ?? rawProgress.completionRate ?? rawProgress.overallProgress ?? 0,
        attendanceRate: rawProgress.attendanceRate ?? rawProgress.attendance ?? rawStats.attendancePercentage ?? 0,
        totalXp: rawProgress.totalXp ?? rawProgress.xp ?? rawStats.xp ?? 0,
        overallProgress: rawProgress.overallProgress ?? rawProgress.courseProgress ?? 0,
      });

      // 4. Map Activities & Deliverables (Safely handling direct array vs nested object formats)
      let sessionsList = [];
      let tasksList = [];

      if (Array.isArray(data?.upcomingActivities)) {
        // Handle when upcomingActivities is an array of mixed items
        sessionsList = data.upcomingActivities.filter(
          (item) => item.type === "Session" || item.type === "Workshop" || item.type === "Interview" || item.mentor || item.speaker
        );
        tasksList = data.upcomingActivities.filter(
          (item) => item.type === "Assignment" || item.type === "Task" || item.dueDate || item.status !== "completed"
        );
      } else if (data?.upcomingActivities && typeof data.upcomingActivities === "object") {
        // Handle when upcomingActivities is an object with nested arrays
        sessionsList = data.upcomingActivities.sessions || [];
        tasksList = data.upcomingActivities.tasks || [];
      }

      // Populate sessions with secondary fallback keys
      setUpcomingSessions(
        sessionsList.length > 0
          ? sessionsList
          : data?.upcomingSessions || data?.sessions || []
      );

      // Populate tasks with secondary fallback keys
      setPendingTasks(
        tasksList.length > 0
          ? tasksList
          : data?.pendingTasks || data?.tasks || []
      );

      // 5. Map Leaderboard (Handling nested achievements object or flat array)
      const leaderboardData =
        data?.leaderboard ||
        data?.achievements?.leaderboard ||
        data?.rankings ||
        [];
      
      setLeaderboard(Array.isArray(leaderboardData) ? leaderboardData : []);

      // 6. Map Notifications Feed
      const notificationsData =
        data?.notifications ||
        data?.recentNotifications ||
        [];

      setRecentNotifications(Array.isArray(notificationsData) ? notificationsData : []);

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
    // Data Outputs
    activeDrive,
    quickStats,
    progressRing,
    upcomingSessions,
    pendingTasks,
    leaderboard,
    recentNotifications,

    // State Flags
    loading: loadingState === LOADING_STATES.LOADING,
    loadingState,
    error,

    // Actions
    refetch: fetchDashboard,
  };
};

export default useDashboardData;