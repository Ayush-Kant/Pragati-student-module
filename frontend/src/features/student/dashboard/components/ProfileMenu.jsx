import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ProfileMenu({ user, isOpen, onToggle, onClose, onLogout }) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    onClose();
    if (onLogout) {
      await onLogout();
    }
    navigate("/login");
  };

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 rounded-full p-1 hover:bg-gray-50 transition"
      >
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
          {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
        </div>
        <span className="text-sm font-semibold text-gray-700 hidden sm:inline">
          {user?.name || "Student"}
        </span>
        <span className="text-xs text-gray-400">▾</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white p-2 shadow-lg border border-gray-100 z-50">
            <div className="px-3 py-2 border-b border-gray-100 mb-1">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.name || "Student"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || "candidate@pragati.com"}
              </p>
            </div>

            <Link
              to="/student/profile"
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              <span>👤</span> My Profile
            </Link>

            <Link
              to="/student/settings/notifications"
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              <span>⚙️</span> Notification Preferences
            </Link>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 rounded-lg hover:bg-red-50 transition mt-1"
            >
              <span>🚪</span> Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}