import React, { useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import StudentSidebar from "../dashboard/components/StudentSidebar";
import StudentDashboardHeader from "../dashboard/components/StudentDashboardHeader";

const getUnreadCount = (user) => {
  const count = Number(user?.unreadNotificationCount);
  return Number.isFinite(count) && count > 0 ? count : 0;
};

const SIDEBAR_COLLAPSE_KEY = "pragati.student.sidebar.collapsed";

const getInitialCollapsed = () => {
  try {
    return localStorage.getItem(SIDEBAR_COLLAPSE_KEY) === "true";
  } catch {
    return false;
  }
};

export default function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(getInitialCollapsed);
  const { user, logout } = useAuth();

  const unreadCount = useMemo(() => getUnreadCount(user), [user]);

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSE_KEY, String(sidebarCollapsed));
    } catch {
      // Ignore storage failures and keep the current UI state in memory.
    }
  }, [sidebarCollapsed]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <StudentDashboardHeader
        user={user}
        unreadCount={unreadCount}
        onToggleSidebar={() => setSidebarOpen((open) => !open)}
        onLogout={logout}
      />

      <div className="flex min-h-[calc(100vh-4rem)]">
        <StudentSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((collapsed) => !collapsed)}
        />

        <main className="min-w-0 flex-1 bg-gray-50 transition-[margin,width] duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
