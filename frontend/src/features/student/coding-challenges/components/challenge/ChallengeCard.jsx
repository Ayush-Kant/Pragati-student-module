import { memo, useCallback } from 'react';
import { ArrowRight, CheckCircle2, Circle, Languages } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DifficultyBadge from './DifficultyBadge';
import { getChallengeStatusColor, getLanguageLabel } from '../../utils/codingChallengeHelpers';
import { CHALLENGE_STATUS } from '../../constants/codingChallengeConstants';

const ChallengeCard = memo(({ challenge }) => {
  const navigate = useNavigate();
  const handleClick = useCallback(() => navigate(`/student/coding-challenges/${challenge.id}`), [navigate, challenge.id]);
  const StatusIcon = challenge.status === CHALLENGE_STATUS.SOLVED ? CheckCircle2 : Circle;
  const statusColor = getChallengeStatusColor(challenge.status);
  const languages = Array.isArray(challenge.languageSupport) ? challenge.languageSupport : [];

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label={`${challenge.title} — ${challenge.difficulty}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <StatusIcon size={17} className={`shrink-0 ${statusColor}`} />
          <h3 className="truncate text-sm font-bold text-slate-900 group-hover:text-blue-700">{challenge.title}</h3>
        </div>
        <DifficultyBadge difficulty={challenge.difficulty} />
      </div>

      {challenge.problemStatement && (
        <p className="mb-4 line-clamp-2 text-sm leading-6 text-slate-600">{challenge.problemStatement}</p>
      )}

      {challenge.topics?.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {challenge.topics.slice(0, 4).map((topic) => <span key={topic} className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">{topic}</span>)}
          {challenge.topics.length > 4 && <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] text-slate-500">+{challenge.topics.length - 4}</span>}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5"><Languages size={13} />{languages.slice(0, 3).map(getLanguageLabel).join(', ') || 'JavaScript'}</span>
        <span className="inline-flex items-center gap-1 font-semibold text-blue-600">Solve <ArrowRight size={13} /></span>
      </div>
    </button>
  );
});

ChallengeCard.displayName = 'ChallengeCard';
export default ChallengeCard;
