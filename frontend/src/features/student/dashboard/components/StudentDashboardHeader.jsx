import React, { useState } from "react";
import ProfileMenu from "./ProfileMenu";
import NotificationBell from "./NotificationBell";
import ThemeToggle from "../../../../components/common/ThemeToggle";
import { useTheme } from "../../../../context/ThemeContext";

export default function StudentDashboardHeader({
  user,
  unreadCount = 0,
  onToggleSidebar,
  onLogout
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 flex h-16 w-full items-center justify-between border-b px-4 md:px-8 transition-colors duration-300 ${
        isDark
          ? "bg-[#111827] border-gray-800 text-white"
          : "bg-white border-gray-200 text-gray-900"
      }`}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className={`rounded-lg p-2 md:hidden transition-colors duration-200 ${
            isDark
              ? "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          }`}
          aria-label="Toggle navigation menu"
        >
          <span className="text-xl">☰</span>
        </button>
        <span
          className={`text-xl font-bold tracking-tight transition-colors duration-300 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          PRAGATI
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <ThemeToggle />
        <NotificationBell unreadCount={unreadCount} />
        <ProfileMenu
          user={user}
          isOpen={profileOpen}
          onToggle={() => setProfileOpen(!profileOpen)}
          onClose={() => setProfileOpen(false)}
          onLogout={onLogout}
        />
      </div>
    </header>
  );
}