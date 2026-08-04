import React from "react";
import PropTypes from "prop-types";

export default function ActivityCard({
  title = "Untitled Activity",
  subtitle = "General Session",
  time = "TBD",
  type = "Session",
}) {
  const typeStyles = {
    Session: "border-blue-400 bg-blue-50/50 text-blue-700",
    Assignment: "border-orange-400 bg-orange-50/50 text-orange-700",
    Quiz: "border-purple-400 bg-purple-50/50 text-purple-700",
    Workshop: "border-emerald-400 bg-emerald-50/50 text-emerald-700",
  };

  const currentTypeStyle = typeStyles[type] || "border-gray-300 bg-gray-50 text-gray-700";

  return (
    <div className={`border-l-4 p-3 rounded-r-xl bg-white shadow-xs transition-all border ${currentTypeStyle}`}>
      <div className="flex justify-between items-start gap-2">
        <p className="text-sm font-semibold tracking-tight text-gray-800">{title}</p>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white border border-current shrink-0">
          {type}
        </span>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {subtitle} · <span className="font-medium text-gray-700">{time}</span>
      </p>
    </div>
  );
}

ActivityCard.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  time: PropTypes.string,
  type: PropTypes.string,
};