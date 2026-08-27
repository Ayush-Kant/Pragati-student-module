import React, { useState } from "react";
import StudentNavbar from "../components/StudentNavbar";
import UpcomingSessions from "../components/sessions/UpcomingSessions";
import NotificationList from "../components/notifications/NotificationList";

export default function StudentDashboardPage() {
  const [activeTab, setActiveTab] = useState("sessions");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar with Sign Out */}
      <StudentNavbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-gray-200 pb-2">
          <button
            onClick={() => setActiveTab("sessions")}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
              activeTab === "sessions"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Sessions
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
              activeTab === "notifications"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Notifications
          </button>
        </div>

        {/* Tab Views */}
        <div className="mt-4">
          {activeTab === "sessions" && <UpcomingSessions />}
          {activeTab === "notifications" && <NotificationList />}
        </div>
      </main>
    </div>
  );
}