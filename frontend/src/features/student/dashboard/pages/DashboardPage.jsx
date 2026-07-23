import React from "react";
import useDashboardData from "../hooks/useDashboardData";
import LeaderboardPreview from "../components/leaderboard/LeaderboardPreview";

// ── Overview Components ──
import WelcomeBanner from "../components/stats/WelcomeBanner";
import StatisticsCards from "../components/stats/StatisticsCards";
import QuickActions from "../components/stats/QuickActions";

// ── Progress & Drives Components ──
import ActiveDriveCard from "../components/activeDrive/ActiveDriveCard";
import ProgressOverview from "../components/progress/ProgressOverview";

// ── Activity & Notification Components ──
import UpcomingActivities from "../components/sessions/UpcomingActivities";
import NotificationPanel from "../components/notifications/NotificationPanel";

// ── Common Fallbacks ──
import LoadingSpinner from "../components/common/LoadingSpinner";

const DashboardPage = () => {
  const {
    activeDrive,
    quickStats,
    progressRing,
    upcomingSessions,
    pendingTasks,
    leaderboard,
    recentNotifications,
    loading,
    error,
    refetch,
  } = useDashboardData();

  // Handle click events for Quick Action items
  const handleQuickAction = (actionId) => {
    switch (actionId) {
      case "drives":
        console.log("Navigating to Active Drives...");
        break;
      case "mock":
        console.log("Opening Mock Call Scheduler...");
        break;
      case "resume":
        console.log("Navigating to Resume Builder...");
        break;
      default:
        console.log("Action triggered:", actionId);
    }
  };

  // Safely extract student name for Welcome Banner
  const studentName = activeDrive?.studentName || quickStats?.studentName || "Student";

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">

        {/* ── Page Header ── */}
        <WelcomeBanner studentName={studentName} />

        {/* ── Global Error Banner ── */}
        {error && (
          <div className="flex items-center justify-between gap-3 bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl">
            <span className="flex items-center gap-2">⚠ {error}</span>
            <button 
              onClick={refetch} 
              type="button"
              className="text-xs font-semibold underline hover:text-red-800 transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Initial Global Loading State ── */}
        {loading && !quickStats ? (
          <div className="py-12 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {/* ── Top Metrics Row ── */}
            <StatisticsCards data={quickStats} loading={loading} />

            {/* ── Placement Drives & Quick Actions ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2">
                <ActiveDriveCard data={activeDrive} loading={loading} />
              </div>
              <div className="lg:col-span-1">
                <QuickActions onActionClick={handleQuickAction} />
              </div>
            </div>

            {/* ── Progress Metrics Section ── */}
            <ProgressOverview data={progressRing} loading={loading} />

            {/* ── Upcoming Schedules & Deliverables ── */}
            <UpcomingActivities 
              sessions={upcomingSessions} 
              tasks={pendingTasks} 
              loading={loading} 
            />

            {/* ── Bottom Row (Notifications & Leaderboard) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2">
                <NotificationPanel data={recentNotifications} loading={loading} />
              </div>
              <div className="lg:col-span-1">
                <LeaderboardPreview
                  leaderboard={leaderboard}
                  loading={loading}
                  error={error}
                />
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default DashboardPage;