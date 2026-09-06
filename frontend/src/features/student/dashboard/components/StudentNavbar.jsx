import React from "react";
import { useNavigate } from "react-router-dom";

import ThemeToggle from "../../../../components/common/ThemeToggle";

export default function StudentNavbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <header className="bg-white dark:bg-[#111827] border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors duration-300">
            Pragati
          </span>
          <span className="text-xs bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full font-medium transition-colors duration-300">
            Student Portal
          </span>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <ThemeToggle />
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-300">
              {user?.name || "Student"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
              {user?.email || "candidate@pragati.com"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}