import React, { useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import StudentSidebar from "../components/StudentSidebar";
import StudentDashboardHeader from "../components/StudentDashboardHeader";
import ActiveDriveCard from "../components/ActiveDriveCard";
import QuickStatsBar from "../components/QuickStatsBar";
import ProgressSection from "../components/ProgressSection";
import UpcomingSessionsList from "../components/UpcomingSessionsList";
import PendingTasksList from "../components/PendingTasksList";
import RecentNotifications from "../components/RecentNotifications";
import LeaderboardPreview from "../components/LeaderboardPreview";
import { useDashboardData } from "../hooks/useDashboardData";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { dashboardData, loading, error, retry } = useDashboardData();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-6 space-y-4">
        <p className="text-red-600 font-semibold text-lg">{error}</p>
        <button
          onClick={retry}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <StudentDashboardHeader
        user={user}
        unreadCount={dashboardData?.notifications?.filter((n) => !n.read).length || 0}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onLogout={logout}
      />

      <div className="flex flex-1">
        <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Good morning, {user?.name || "Student"} 👋
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Here is your learning summary and upcoming schedule for today.
            </p>
          </div>

          <ActiveDriveCard drive={dashboardData?.activeDrive} />
          <QuickStatsBar stats={dashboardData?.stats} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ProgressSection progress={dashboardData?.progress} />
              <UpcomingSessionsList sessions={dashboardData?.upcomingSessions} />
              <PendingTasksList tasks={dashboardData?.pendingTasks} />
            </div>

            <div className="space-y-6">
              <LeaderboardPreview leaderboard={dashboardData?.leaderboard} />
              <RecentNotifications notifications={dashboardData?.notifications} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}