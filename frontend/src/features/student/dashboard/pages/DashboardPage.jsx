import React from "react";
import useDashboardData from "../hooks/useDashboardData";
import LeaderboardPreview from "../components/leaderboard/LeaderboardPreview";

// ── Correct Modularity: Import your newly created sub-components ──
import ActiveDriveCard from "../components/drives/ActiveDriveCard";
import QuickStats from "../components/stats/QuickStats";
import ProgressRing from "../components/progress/ProgressRing";
import UpcomingSessions from "../components/sessions/UpcomingSessions";
import PendingTasks from "../components/tasks/PendingTasks";
import NotificationsList from "../components/notifications/NotificationsList";

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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Your placement journey at a glance</p>
          </div>
        </div>

        {/* ── Global Error Banner ── */}
        {error && (
          <div className="mb-5 flex items-center justify-between gap-3 bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl">
            <span className="flex items-center gap-2">⚠ {error}</span>
            <button onClick={refetch} className="text-xs font-semibold underline hover:text-red-800 transition-colors">Retry</button>
          </div>
        )}

        {/* ── Top Row (Metrics & Progress) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
          <ActiveDriveCard data={activeDrive} loading={loading} />
          <QuickStats data={quickStats} loading={loading} />
          <ProgressRing data={progressRing} loading={loading} />
        </div>

        {/* ── Middle Row (Schedules & Deliverables) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
          <UpcomingSessions data={upcomingSessions} loading={loading} />
          <PendingTasks data={pendingTasks} loading={loading} />
          <NotificationsList data={recentNotifications} loading={loading} />
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