import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../../../context/ThemeContext";

export default function ProfileMenu({ user, isOpen, onToggle, onClose, onLogout }) {
  const navigate = useNavigate();
  const { isDark } = useTheme();

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
        className={`flex items-center gap-2 rounded-full p-1 transition-colors duration-200 ${
          isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
          {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
        </div>
        <span
          className={`text-sm font-semibold hidden sm:inline transition-colors duration-200 ${
            isDark ? "text-gray-200" : "text-gray-700"
          }`}
        >
          {user?.name || "Student"}
        </span>
        <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-400"}`}>▾</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <div
            className={`absolute right-0 mt-2 w-56 rounded-xl p-2 shadow-xl border z-50 transition-colors duration-200 ${
              isDark
                ? "bg-[#1e293b] border-gray-700 text-white"
                : "bg-white border-gray-200 text-gray-900"
            }`}
          >
            <div
              className={`px-3 py-2 border-b mb-1 ${
                isDark ? "border-gray-700" : "border-gray-100"
              }`}
            >
              <p
                className={`text-sm font-semibold truncate ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {user?.name || "Student"}
              </p>
              <p
                className={`text-xs truncate ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {user?.email || "candidate@pragati.com"}
              </p>
            </div>

            <Link
              to="/student/profile"
              onClick={onClose}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors duration-150 ${
                isDark
                  ? "text-gray-200 hover:bg-gray-800 hover:text-white"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span>👤</span> My Profile
            </Link>

            <Link
              to="/student/settings/notifications"
              onClick={onClose}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors duration-150 ${
                isDark
                  ? "text-gray-200 hover:bg-gray-800 hover:text-white"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span>⚙️</span> Notification Preferences
            </Link>

            <button
              onClick={handleSignOut}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors duration-150 mt-1 ${
                isDark
                  ? "text-red-400 hover:bg-red-900/30"
                  : "text-red-600 hover:bg-red-50"
              }`}
            >
              <span>🚪</span> Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}