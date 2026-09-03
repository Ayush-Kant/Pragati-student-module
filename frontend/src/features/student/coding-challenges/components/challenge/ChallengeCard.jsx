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
 */
const ChallengeCard = memo(({ challenge }) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate(`/student/coding-challenges/${challenge.id}`);
  }, [navigate, challenge.id]);

  const StatusIcon = challenge.status === CHALLENGE_STATUS.SOLVED ? CheckCircle2 : Circle;
  const statusColor = getChallengeStatusColor(challenge.status);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleClick();
        }
      }}
      className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/30"
      aria-label={`${challenge.title} — ${challenge.difficulty}`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <StatusIcon size={16} className={`shrink-0 ${statusColor.replace('text-gray-', 'text-slate-')}`} aria-hidden="true" />
          <h3 className="truncate text-sm font-semibold text-slate-900">{challenge.title}</h3>
        </div>
        <DifficultyBadge difficulty={challenge.difficulty} />
      </div>

      {challenge.topics?.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {challenge.topics.slice(0, 3).map((topic) => (
            <span key={topic} className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600">
              {topic}
            </span>
          ))}
          {challenge.topics.length > 3 && (
            <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-500">
              +{challenge.topics.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <CheckCircle2 size={12} className="text-emerald-600" aria-hidden="true" />
          <span>{formatAcceptanceRate(challenge.acceptanceRate)} acceptance</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={12} aria-hidden="true" />
          <span>{challenge.timeLimit ?? '—'} ms</span>
          <Users size={12} className="ml-2" aria-hidden="true" />
          <span>{Number(challenge.totalSubmissions || 0).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
});

ChallengeCard.displayName = 'ChallengeCard';

export default ChallengeCard;
