import { memo } from 'react';
import { Trophy } from 'lucide-react';
import LanguageBadge from '../challenge/LanguageBadge';

const RANK_STYLES = {
  1: 'border-yellow-500/40 bg-yellow-500/5 shadow-yellow-500/10',
  2: 'border-gray-400/40 bg-gray-400/5 shadow-gray-400/10',
  3: 'border-orange-500/40 bg-orange-500/5 shadow-orange-500/10',
};

const RANK_TROPHY_COLORS = {
  1: 'text-yellow-400',
  2: 'text-gray-300',
  3: 'text-orange-500',
};

const AVATAR_COLORS = [
  'from-orange-500 to-orange-600',
  'from-teal-500 to-teal-600',
  'from-violet-500 to-violet-600',
];

/**
 * Podium card for a top-ranked coder.
 *
 * @param {{ entry: object, rank: number }} props
 */
const RankCard = memo(({ entry, rank }) => {
  const borderClass = RANK_STYLES[rank] ?? 'border-gray-800';
  const trophyClass = RANK_TROPHY_COLORS[rank];
  const avatarGradient = AVATAR_COLORS[(rank - 1) % AVATAR_COLORS.length];

  return (
    <div
      className={`relative border rounded-2xl p-5 text-center shadow-xl transition-transform hover:-translate-y-1 duration-200 ${borderClass} ${
        entry.isCurrentUser ? 'ring-1 ring-orange-500/40' : ''
      }`}
      aria-label={`Rank ${rank}: ${entry.name}`}
    >
      {rank <= 3 && trophyClass && (
        <Trophy
          size={20}
          className={`absolute top-3 right-3 ${trophyClass}`}
          aria-hidden="true"
        />
      )}

      {/* Avatar */}
      <div
        className={`w-14 h-14 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white text-xl font-bold mx-auto mb-3 shadow-lg`}
        aria-hidden="true"
      >
        {entry.avatar}
      </div>

      <p className="font-bold text-gray-100 text-sm truncate">
        {entry.name}
        {entry.isCurrentUser && (
          <span className="ml-1 text-orange-400 text-xs">(You)</span>
        )}
      </p>

      <p className="text-2xl font-extrabold text-orange-400 mt-1">{entry.score.toLocaleString()}</p>
      <p className="text-xs text-gray-500 mb-3">{entry.solved} solved</p>

      {/* Languages */}
      <div className="flex flex-wrap gap-1 justify-center">
        {entry.languages.slice(0, 2).map((lang) => (
          <LanguageBadge key={lang} language={lang} />
        ))}
      </div>
    </div>
  );
});

RankCard.displayName = 'RankCard';

export default RankCard;
