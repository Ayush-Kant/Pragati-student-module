import { memo } from 'react';
import { Trophy, Target, Flame } from 'lucide-react';

/**
 * Summary stats bar for the current user's leaderboard standing.
 *
 * @param {{ entry: object | undefined }} props
 */
const ScoreSummary = memo(({ entry }) => {
  if (!entry) return null;

  const stats = [
    { icon: Trophy, label: 'Your Rank',   value: `#${entry.rank}`,              color: 'text-orange-400' },
    { icon: Target, label: 'Score',       value: entry.score.toLocaleString(),  color: 'text-teal-400'   },
    { icon: Target, label: 'Solved',      value: entry.solved,                  color: 'text-gray-200'   },
    { icon: Flame,  label: 'Streak',      value: `${entry.streak} days`,        color: 'text-orange-300' },
  ];

  return (
    <div className="bg-gradient-to-r from-orange-500/10 via-[#0a0a0a] to-teal-500/10 border border-gray-800 rounded-2xl p-5">
      <p className="text-xs text-gray-400 font-medium mb-3 uppercase tracking-wide">Your Standing</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="text-center">
            <Icon size={16} className={`mx-auto mb-1 ${color}`} aria-hidden="true" />
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
});

ScoreSummary.displayName = 'ScoreSummary';

export default ScoreSummary;
