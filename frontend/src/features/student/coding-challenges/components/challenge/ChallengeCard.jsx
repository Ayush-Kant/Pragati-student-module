import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, Clock, Users } from 'lucide-react';
import DifficultyBadge from './DifficultyBadge';
import {
  formatAcceptanceRate,
  getChallengeStatusColor,
} from '../../utils/codingChallengeHelpers';
import { CHALLENGE_STATUS } from '../../constants/codingChallengeConstants';

/**
 * Card representing a single coding challenge in the list.
 *
 * @param {{ challenge: object }} props
 */
const ChallengeCard = memo(({ challenge }) => {
  const navigate = useNavigate();

  // Issue 3 fix: useCallback preserves referential stability so memo(ChallengeCard) is
  // not re-rendered every time the parent list re-renders (e.g. filter state changes).
  const handleClick = useCallback(() => {
    navigate(`/student/coding/${challenge.id}`);
  }, [navigate, challenge.id]);

  const StatusIcon =
    challenge.status === CHALLENGE_STATUS.SOLVED
      ? CheckCircle2
      : Circle;

  const statusColor = getChallengeStatusColor(challenge.status);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      // Issue 4 fix: ARIA role="button" requires both Enter AND Space to activate.
      // preventDefault on Space prevents the page from scrolling down.
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-5 cursor-pointer group
        hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10
        hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-orange-500/50"
      aria-label={`${challenge.title} — ${challenge.difficulty}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <StatusIcon
            size={16}
            className={`flex-shrink-0 ${statusColor}`}
            aria-hidden="true"
          />
          <h3 className="text-sm font-semibold text-gray-100 truncate group-hover:text-orange-400 transition-colors">
            {challenge.title}
          </h3>
        </div>
        <DifficultyBadge difficulty={challenge.difficulty} />
      </div>

      {/* Topics */}
      {challenge.topics?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {challenge.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="text-xs px-2 py-0.5 rounded-md bg-gray-800/80 text-gray-400 border border-gray-700/50"
            >
              {topic}
            </span>
          ))}
          {challenge.topics.length > 3 && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-gray-800/80 text-gray-500">
              +{challenge.topics.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer stats */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <CheckCircle2 size={12} className="text-teal-500/60" aria-hidden="true" />
          <span>{formatAcceptanceRate(challenge.acceptanceRate)} acceptance</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={12} aria-hidden="true" />
          <span>{challenge.timeLimit} ms</span>
          <Users size={12} className="ml-2" aria-hidden="true" />
          <span>{(challenge.totalSubmissions / 1_000_000).toFixed(1)}M</span>
        </div>
      </div>
    </div>
  );
});

ChallengeCard.displayName = 'ChallengeCard';

export default ChallengeCard;
