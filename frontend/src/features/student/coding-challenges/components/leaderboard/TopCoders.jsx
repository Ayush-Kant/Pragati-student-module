import { memo } from 'react';
import RankCard from './RankCard';
import { TOP_CODERS_COUNT } from '../../constants/codingChallengeConstants';

/**
 * Podium section showing the top N coders as RankCards.
 *
 * @param {{ leaderboard: object[] }} props
 */
const TopCoders = memo(({ leaderboard }) => {
  const top = leaderboard.slice(0, TOP_CODERS_COUNT);

  if (!top.length) return null;

  // Re-order to podium: 2nd, 1st, 3rd (classic podium display)
  const podium =
    top.length === 3
      ? [top[1], top[0], top[2]]
      : top;

  return (
    <section aria-labelledby="top-coders-heading">
      <h2 id="top-coders-heading" className="sr-only">Top Coders</h2>
      <div className="flex items-end justify-center gap-4 flex-wrap">
        {podium.map((entry) => (
          <div
            key={entry.userId}
            className={`flex-1 min-w-[140px] max-w-[200px] ${
              entry.rank === 1 ? 'mt-0' : 'mt-8'
            }`}
          >
            <RankCard entry={entry} rank={entry.rank} />
          </div>
        ))}
      </div>
    </section>
  );
});

TopCoders.displayName = 'TopCoders';

export default TopCoders;
