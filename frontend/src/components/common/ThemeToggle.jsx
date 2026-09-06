import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle({
  className = "",
  size = 22,
  variant = "inline", // "inline" | "floating"
  title,
}) {
  const { isDark, toggleTheme } = useTheme();

  const tooltipText =
    title || (isDark ? "Switch to light theme" : "Switch to dark theme");

  if (variant === "floating") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={tooltipText}
        title={tooltipText}
        className={`fixed top-4 right-4 z-50 rounded-full p-2.5 transition-colors duration-300 focus:outline-none focus:ring-2 active:scale-95 ${
          isDark
            ? "text-amber-400 hover:bg-slate-800/80 focus:ring-gray-700"
            : "text-gray-600 hover:bg-gray-200/70 hover:text-gray-900 focus:ring-blue-100"
        } ${className}`}
      >
        {isDark ? (
          <Sun size={24} className="transition-transform duration-300 rotate-0 hover:rotate-45 text-amber-400" />
        ) : (
          <Moon size={24} className="transition-transform duration-300 rotate-0 hover:-rotate-12 text-gray-600" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={tooltipText}
      title={tooltipText}
      className={`relative rounded-full p-2 transition-colors duration-300 focus:outline-none focus:ring-2 active:scale-95 ${
        isDark
          ? "text-gray-300 hover:bg-gray-800 hover:text-white focus:ring-gray-700"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-blue-100"
      } ${className}`}
    >
      {isDark ? (
        <Sun size={size} className="text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon size={size} className="text-gray-600 transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
}
