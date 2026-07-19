import React from "react";
import PropTypes from "prop-types";

export default function XPProgressCard({ xp = 0, loading }) {
  if (loading) {
    return <div className="h-28 bg-gray-100 rounded-2xl animate-pulse" />;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <span className="text-sm font-semibold text-gray-400 block mb-2">✨ Total Experience (XP)</span>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-gray-800 tracking-tight">{xp}</span>
        <span className="text-xs font-semibold text-purple-600">XP</span>
      </div>
      <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-purple-500 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${Math.min((xp / 2000) * 100, 100)}%` }}
        />
      </div>
      <p className="text-[10px] text-gray-400 mt-1.5 text-right">Next Milestone: 2,000 XP</p>
    </div>
  );
}

XPProgressCard.propTypes = {
  xp: PropTypes.number,
  loading: PropTypes.bool,
};