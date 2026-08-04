import React from "react";
import PropTypes from "prop-types";
import LeaderboardCard from "./LeaderboardCard";
import { LEADERBOARD_PREVIEW_LIMIT } from "../../constants/dashboardConstants";

// Skeleton row with a unique key pattern
const SkeletonRow = () => (
  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 animate-pulse">
    <div className="w-8 h-4 bg-gray-200 rounded" />
    <div className="w-9 h-9 bg-gray-200 rounded-full shrink-0" />
    <div className="flex-1 flex flex-col gap-1.5">
      <div className="h-3 w-28 bg-gray-200 rounded" />
      <div className="h-2 w-20 bg-gray-200 rounded" />
    </div>
    <div className="h-4 w-10 bg-gray-200 rounded" />
  </div>
);

const LeaderboardPreview = ({
  leaderboard = [],
  loading = false,
  error = null,
  currentUserName = "Vaishnavi Chaudhari",
}) => {
  // Ensure leaderboard is strictly treated as an array
  const safeLeaderboard = Array.isArray(leaderboard) ? leaderboard : [];
  const topEntries = safeLeaderboard.slice(0, LEADERBOARD_PREVIEW_LIMIT || 5);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏆</span>
          <h3 className="text-base font-bold text-gray-800">Leaderboard</h3>
        </div>
        <button type="button" className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer">
          View All
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-medium px-3 py-2 rounded-lg mb-3">
          ⚠ Failed to load leaderboard
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonRow key={`skeleton-leaderboard-${i}`} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && topEntries.length === 0 && (
        <div className="flex-1 flex items-center justify-center py-8">
          <p className="text-sm text-gray-400 italic">No leaderboard data available yet.</p>
        </div>
      )}

      {/* Data List */}
      {!loading && !error && topEntries.length > 0 && (
        <div className="flex flex-col gap-2">
          {topEntries.map((entry, index) => {
            const uniqueKey = entry?.id || (entry?.rank ? `rank-${entry.rank}` : `leaderboard-item-${index}`);
            return (
              <LeaderboardCard
                key={uniqueKey}
                rank={entry?.rank || index + 1}
                name={entry?.name || entry?.studentName}
                score={entry?.score ?? entry?.xp ?? 0}
                department={entry?.department || "Computer Science"}
                avatarColor={entry?.avatarColor}
                isCurrentUser={entry?.name === currentUserName}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

LeaderboardPreview.propTypes = {
  leaderboard: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string,
  currentUserName: PropTypes.string,
};

export default LeaderboardPreview;