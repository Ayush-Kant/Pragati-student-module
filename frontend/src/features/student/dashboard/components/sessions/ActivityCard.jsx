import React from "react";
import PropTypes from "prop-types";

export default function ActivityCard({ title, subtitle, time, type }) {
  const typeStyles = {
    Session: "border-blue-400 bg-blue-50/50 text-blue-700",
    Assignment: "border-orange-400 bg-orange-50/50 text-orange-700",
    Quiz: "border-purple-400 bg-purple-50/50 text-purple-700",
  };

  return (
    <div className={`border-l-4 p-3 rounded-r-xl bg-white shadow-xs transition-all border ${typeStyles[type] || "border-gray-300 bg-gray-50 text-gray-700"}`}>
      <div className="flex justify-between items-start gap-2">
        <p className="text-sm font-semibold tracking-tight">{title}</p>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white border border-current shrink-0">
          {type}
        </span>
      </div>
      <p className="text-xs text-gray-500 mt-1">{subtitle} · <span className="font-medium text-gray-700">{time}</span></p>
    </div>
  );
}

ActivityCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};