
import { RANK_BADGE } from "../../constants/dashboardConstants";

const LeaderboardCard = ({ rank, name, score, department, avatarColor, isCurrentUser }) => {
  const badge = RANK_BADGE[rank];

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
        ${isCurrentUser
          ? "bg-blue-50 border border-blue-200"
          : "bg-white border border-gray-100 hover:bg-gray-50"
        }`}
    >
      {/* Rank */}
      <div className="w-8 flex items-center justify-center shrink-0">
        {badge ? (
          <span className={`text-lg ${badge.color}`}>{badge.emoji}</span>
        ) : (
          <span className="text-sm font-bold text-gray-400">#{rank}</span>
        )}
      </div>

      {/* Avatar */}
      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColor || "bg-gray-100 text-gray-600"}`}>
        {initials}
      </div>

      {/* Name + Department */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">
          {name} {isCurrentUser && <span className="text-xs text-blue-500 font-normal">(You)</span>}
        </p>
        <p className="text-xs text-gray-400 truncate">{department}</p>
      </div>

      {/* Score */}
      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-gray-800">{score}</p>
        <p className="text-[10px] text-gray-400 uppercase tracking-wide">pts</p>
      </div>
    </div>
  );
};

export default LeaderboardCard;
