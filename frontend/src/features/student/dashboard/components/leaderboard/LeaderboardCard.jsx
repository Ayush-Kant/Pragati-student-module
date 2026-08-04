import React from "react";
import PropTypes from "prop-types";
import { RANK_BADGE } from "../../constants/dashboardConstants";

const LeaderboardCard = ({ 
  rank = 0, 
  name = "", 
  score = 0, 
  department = "Computer Science", 
  avatarColor = "", 
  isCurrentUser = false 
}) => {
  const badge = RANK_BADGE ? RANK_BADGE[rank] : null;

  // Safe name resolution to avoid runtime crashes when name is missing or null
  const displayName = name && name.trim() ? name.trim() : `Student ${rank ? `#${rank}` : ""}`;

  // Safe initials extraction
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "ST";

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
        ${isCurrentUser
          ? "bg-blue-50 border border-blue-200"
          : "bg-white border border-gray-100 hover:bg-gray-50"
        }`}
    >
      {/* Rank Badge / Number */}
      <div className="w-8 flex items-center justify-center shrink-0">
        {badge ? (
          <span className={`text-lg ${badge.color}`}>{badge.emoji}</span>
        ) : (
          <span className="text-sm font-bold text-gray-400">#{rank || "-"}</span>
        )}
      </div>

      {/* Avatar */}
      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColor || "bg-blue-100 text-blue-700"}`}>
        {initials}
      </div>

      {/* Name + Department */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">
          {displayName} {isCurrentUser && <span className="text-xs text-blue-500 font-normal">(You)</span>}
        </p>
        {department && <p className="text-xs text-gray-400 truncate">{department}</p>}
      </div>

      {/* Score */}
      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-gray-800">{score}</p>
        <p className="text-[10px] text-gray-400 uppercase tracking-wide">pts</p>
      </div>
    </div>
  );
};

LeaderboardCard.propTypes = {
  rank: PropTypes.number,
  name: PropTypes.string,
  score: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  department: PropTypes.string,
  avatarColor: PropTypes.string,
  isCurrentUser: PropTypes.bool,
};

export default LeaderboardCard;