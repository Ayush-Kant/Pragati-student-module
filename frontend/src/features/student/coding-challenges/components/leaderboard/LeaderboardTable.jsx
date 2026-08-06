import { memo } from 'react';
import { Flame } from 'lucide-react';
import LanguageBadge from '../challenge/LanguageBadge';
import { TOP_CODERS_COUNT } from '../../constants/codingChallengeConstants';

/**
 * Full ranked table of coders, below the podium.
 * Highlights the current user's row.
 *
 * @param {{ leaderboard: object[] }} props
 */
const LeaderboardTable = memo(({ leaderboard }) => {
  const rows = leaderboard.slice(TOP_CODERS_COUNT);

  if (!rows.length) return null;

  return (
    <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-12 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500 border-b border-gray-800 bg-[#080808]">
        <span className="col-span-1 text-center">#</span>
        <span className="col-span-4">Coder</span>
        <span className="col-span-2 text-right">Score</span>
        <span className="col-span-2 text-right">Solved</span>
        <span className="col-span-2 text-right">Streak</span>
        <span className="col-span-1 text-right">Lang</span>
      </div>

      {/* Rows */}
      <div role="list" aria-label="Leaderboard">
        {rows.map((entry) => (
          <div
            key={entry.userId}
            role="listitem"
            className={`grid grid-cols-12 items-center px-4 py-3 border-b border-gray-800/60 last:border-0 transition-colors duration-150 ${
              entry.isCurrentUser
                ? 'bg-orange-500/5 border-l-2 border-l-orange-500'
                : 'hover:bg-gray-900/30'
            }`}
            aria-label={`${entry.name}, rank ${entry.rank}`}
          >
            {/* Rank */}
            <div className="col-span-1 text-center">
              <span className={`text-sm font-bold ${entry.isCurrentUser ? 'text-orange-400' : 'text-gray-400'}`}>
                {entry.rank}
              </span>
            </div>

            {/* Name + avatar */}
            <div className="col-span-4 flex items-center gap-2.5 min-w-0">
              <div
                className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                aria-hidden="true"
              >
                {entry.avatar}
              </div>
              <span className={`text-sm font-medium truncate ${entry.isCurrentUser ? 'text-orange-300' : 'text-gray-200'}`}>
                {entry.name}
                {entry.isCurrentUser && ' (You)'}
              </span>
            </div>

            {/* Score */}
            <div className="col-span-2 text-right">
              <span className="text-sm font-semibold text-orange-400">
                {entry.score.toLocaleString()}
              </span>
            </div>

            {/* Solved */}
            <div className="col-span-2 text-right">
              <span className="text-sm text-teal-400">{entry.solved}</span>
            </div>

            {/* Streak */}
            <div className="col-span-2 text-right">
              <span className="inline-flex items-center gap-1 text-xs text-orange-300">
                <Flame size={12} aria-hidden="true" />
                {entry.streak}d
              </span>
            </div>

            {/* Language */}
            <div className="col-span-1 flex justify-end">
              {entry.languages?.[0] && (
                <LanguageBadge language={entry.languages[0]} />
              )}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
});

LeaderboardTable.displayName = 'LeaderboardTable';

export default LeaderboardTable;
