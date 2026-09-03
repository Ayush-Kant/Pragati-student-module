import { useMemo } from 'react';
import { CheckCircle2, Circle, Code2, Minus, Search } from 'lucide-react';
import { useCodingChallenges } from '../hooks/useCodingChallenges';
import ChallengeCard from '../components/challenge/ChallengeCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import CodingChallengeErrorBoundary from '../components/common/CodingChallengeErrorBoundary';
import { DIFFICULTY, CHALLENGE_STATUS, TOPICS } from '../constants/codingChallengeConstants';

const CodingChallengesPage = () => {
  const {
    challenges, filteredChallenges, paginatedChallenges, isLoading, error,
    searchQuery, difficultyFilter, topicFilter, statusFilter, currentPage, totalPages,
    setSearchQuery, setDifficultyFilter, setTopicFilter, setStatusFilter, setCurrentPage, refetch,
  } = useCodingChallenges();

  const stats = useMemo(() => ({
    solved: challenges.filter((c) => c.status === CHALLENGE_STATUS.SOLVED).length,
    attempted: challenges.filter((c) => c.status === CHALLENGE_STATUS.ATTEMPTED).length,
    unsolved: challenges.filter((c) => c.status === CHALLENGE_STATUS.UNSOLVED).length,
    total: challenges.length,
  }), [challenges]);

  if (isLoading) return <div className="flex min-h-[60vh] items-center justify-center"><LoadingSpinner size="lg" label="Loading challenges…" /></div>;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <CodingChallengeErrorBoundary>
      <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600"><Code2 size={22} /></div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Coding Challenges</h1>
                <p className="mt-1 text-sm text-slate-500">Practice interview-style problems with the same focused workflow as a real coding round.</p>
              </div>
            </div>
          </div>

          <div className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              ['Total', stats.total, Code2], ['Solved', stats.solved, CheckCircle2], ['Attempted', stats.attempted, Minus], ['Unsolved', stats.unsolved, Circle],
            ].map(([label, value, Icon]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <Icon size={18} className="mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-slate-900">{value}</div>
                <div className="text-xs font-medium text-slate-500">{label}</div>
              </div>
            ))}
          </div>

          <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="relative">
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by problem title or topic…"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100" />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {['All', ...Object.values(DIFFICULTY)].map((difficulty) => (
                <button key={difficulty} type="button" onClick={() => setDifficultyFilter(difficulty)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${difficultyFilter === difficulty ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>
                  {difficulty}
                </button>
              ))}
              <span className="mx-1 hidden h-5 w-px bg-slate-200 sm:block" />
              {['All', ...Object.values(CHALLENGE_STATUS)].map((status) => (
                <button key={status} type="button" onClick={() => setStatusFilter(status)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${statusFilter === status ? 'border-violet-600 bg-violet-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>
                  {status}
                </button>
              ))}
              <select value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500">
                <option value="All">All topics</option>
                {TOPICS.map((topic) => <option key={topic} value={topic}>{topic}</option>)}
              </select>
            </div>
          </div>

          <div className="mb-4 flex items-end justify-between">
            <div><h2 className="text-lg font-bold text-slate-900">{filteredChallenges.length} {filteredChallenges.length === 1 ? 'challenge' : 'challenges'}</h2><p className="text-xs text-slate-500">{totalPages > 1 ? `Page ${currentPage} of ${totalPages}` : 'Choose a problem to begin solving.'}</p></div>
          </div>

          {paginatedChallenges.length === 0 ? (
            <EmptyState title="No challenges found" description="Try changing the search or filters." icon="🔍" />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {paginatedChallenges.map((challenge) => <ChallengeCard key={challenge.id} challenge={challenge} />)}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </>
          )}
        </div>
      </div>
    </CodingChallengeErrorBoundary>
  );
};

export default CodingChallengesPage;
