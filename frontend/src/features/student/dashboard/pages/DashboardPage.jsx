import React, { useState } from "react";
import StudentDashboardHeader from "../components/StudentDashboardHeader";
import StudentSidebar from "../components/StudentSidebar";
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
  const { data, leaderboard, loading, error, retry } = useDashboardData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500">Loading your student dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl border max-w-md w-full text-center space-y-4 shadow-sm">
          <p className="text-red-600 font-semibold">Unable to load your dashboard.</p>
          <p className="text-xs text-gray-500">{error}</p>
          <button
            onClick={retry}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const unreadCount = data?.recentNotifications?.filter((n) => !n.readAt).length || 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <StudentDashboardHeader
        unreadCount={unreadCount}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-hidden">
          <h1 className="text-2xl font-bold text-gray-900">Good morning, Student 👋</h1>

          <ActiveDriveCard drive={data?.activeDrive} />
          <QuickStatsBar stats={data?.quickStats} />

          <div className="grid md:grid-cols-2 gap-6">
            <ProgressSection progressRing={data?.progressRing} />
            <UpcomingSessionsList sessions={data?.upcomingSessions} />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <PendingTasksList tasks={data?.pendingTasks} />
            <RecentNotifications notifications={data?.recentNotifications} />
          </div>

          <LeaderboardPreview leaderboard={leaderboard} />
        </main>
      </div>
    </div>
  );
}