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

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ── Page Header ── */}
        <WelcomeBanner />

        {/* ── Global Error Banner ── */}
        {error && (
          <div className="mb-5 flex items-center justify-between gap-3 bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl">
            <span className="flex items-center gap-2">⚠ {error}</span>
            <button onClick={refetch} className="text-xs font-semibold underline hover:text-red-800 transition-colors">
              Retry
            </button>
          </div>
        )}

        {/* ── Top Metrics Row ── */}
        <StatisticsCards data={quickStats} loading={loading} />

        {/* ── Placement Drives & Quick Actions ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          <div className="lg:col-span-2">
            <ActiveDriveCard data={activeDrive} loading={loading} />
          </div>
          <div className="lg:col-span-1">
            <QuickActions />
          </div>
        </div>

        {/* ── Progress Metrics Section ── */}
        <ProgressOverview data={progressRing} loading={loading} />

        {/* ── Middle Row (Schedules, Deliverables & Logs) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          <div className="lg:col-span-2">
            <UpcomingActivities 
              sessions={upcomingSessions} 
              tasks={pendingTasks} 
              loading={loading} 
            />
          </div>
          <div className="lg:col-span-1">
            <NotificationPanel data={recentNotifications} loading={loading} />
          </div>
        </div>

        {/* ── Bottom Row (Leaderboard Evaluation) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-1">
            <LeaderboardPreview
              leaderboard={leaderboard}
              loading={loading}
              error={error}
            />
          </div>
          <div className="hidden lg:block lg:col-span-2" />
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;