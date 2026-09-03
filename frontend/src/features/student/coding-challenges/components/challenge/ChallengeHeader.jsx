import { ArrowLeft, History, Trophy, BookOpen, Languages } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DifficultyBadge from './DifficultyBadge';

const ChallengeHeader = ({ challenge }) => {
  const navigate = useNavigate();
  const languages = Array.isArray(challenge.languageSupport) ? challenge.languageSupport : [];
  const sampleCount = Array.isArray(challenge.sampleTestCases) ? challenge.sampleTestCases.length : (challenge.sampleInput ? 1 : 0);

  return (
    <header className="border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => navigate('/student/coding-challenges')}
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
          <ArrowLeft size={16} /> All Challenges
        </button>
        <span className="text-slate-300">/</span>
        <h1 className="min-w-0 flex-1 truncate text-base font-bold text-slate-900">{challenge.title}</h1>
        <DifficultyBadge difficulty={challenge.difficulty} />
        <button type="button" onClick={() => navigate(`/student/coding-challenges/${challenge.id}/submissions`)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700">
          <History size={14} /> History
        </button>
        <button type="button" onClick={() => navigate(`/student/coding-challenges/${challenge.id}/leaderboard`)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700">
          <Trophy size={14} /> Leaderboard
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5"><BookOpen size={14} /> {challenge.totalMarks ?? 0} marks</span>
        <span className="inline-flex items-center gap-1.5"><Languages size={14} /> {languages.length ? languages.join(', ') : 'JavaScript'}</span>
        <span>{sampleCount} sample test{sampleCount === 1 ? '' : 's'}</span>
        {challenge.bestScore != null && <span>Best score: <strong className="text-slate-700">{challenge.bestScore}</strong></span>}
      </div>
    </header>
  );
};

export default ChallengeHeader;
