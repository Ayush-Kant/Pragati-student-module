import React, { useState } from "react";
import ProfileMenu from "./ProfileMenu";
import NotificationBell from "./NotificationBell";

export default function StudentDashboardHeader({
  user,
  unreadCount = 0,
  onToggleSidebar,
  onLogout
}) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 md:hidden"
        >
          <span className="text-xl">☰</span>
        </button>
        <span className="text-xl font-bold tracking-tight text-gray-900">PRAGATI</span>
      </div>

      <div className="flex items-center gap-4">
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