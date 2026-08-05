import React from "react";
import { useOutletContext } from "react-router-dom";
import { statusStyles } from "../../constants/communicationConstants";

const StatusBadge = ({ status }) => {
  const context = useOutletContext();
  const darkMode = context?.darkMode ?? false;

  const currentStyle = statusStyles[status] || {
    badge: {
      light: "bg-slate-100 text-slate-700 border border-slate-200",
      dark: "bg-slate-500/15 text-slate-400 border border-slate-500/30",
    },
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-sm transition-colors duration-200 ${
        darkMode ? currentStyle.badge.dark : currentStyle.badge.light
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status || "Draft"}
    </span>
  );
};

export default StatusBadge;
