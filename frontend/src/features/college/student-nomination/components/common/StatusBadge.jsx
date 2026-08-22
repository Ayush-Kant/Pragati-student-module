import React from "react";
import { useOutletContext } from "react-router-dom";
import { statusStyles } from "../../constants/studentNominationConstants";

const StatusBadge = ({ status = "Unknown" }) => {
  const { darkMode = false } = useOutletContext() || {};
  
  // Fallback styling if status is not found or malformed in constants
  const defaultStyle = {
    light: "bg-slate-100 text-slate-700 border border-slate-200",
    dark: "bg-slate-500/15 text-slate-400 border border-slate-500/30",
  };

  // Safely resolve the specific status style with fallback chain
  const resolvedStatusStyle = statusStyles[status]?.badge;
  const themeStyles = darkMode 
    ? (resolvedStatusStyle?.dark || defaultStyle.dark)
    : (resolvedStatusStyle?.light || defaultStyle.light);

  // Fallback text display if status value is empty
  const displayStatus = status ? status.toString() : "Unknown";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-sm transition-colors duration-200 ${themeStyles}`}
    >
      {/* Visual Status Dot Indicator */}
      <span className="h-1.5 w-1.5 rounded-full bg-current shrink-0" />
      <span className="truncate">{displayStatus}</span>
    </span>
  );
};

export default StatusBadge;