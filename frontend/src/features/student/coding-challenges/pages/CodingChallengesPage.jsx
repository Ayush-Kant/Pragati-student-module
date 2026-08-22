import { useMemo } from 'react';
import { Code2, CheckCircle2, Circle, Minus } from 'lucide-react';
import { useCodingChallenges } from '../hooks/useCodingChallenges';
import ChallengeCard from '../components/challenge/ChallengeCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import SectionHeader from '../components/common/SectionHeader';
import Pagination from '../components/common/Pagination';
import CodingChallengeErrorBoundary from '../components/common/CodingChallengeErrorBoundary';
import {
  DIFFICULTY,
  CHALLENGE_STATUS,
  TOPICS,
} from '../constants/codingChallengeConstants';

/**
 * Main coding challenges list page.
 * Displays filters, search, paginated grid of ChallengeCards.
 */
const CodingChallengesPage = () => {
  const {
    challenges,
    filteredChallenges,
    paginatedChallenges,
    isLoading,
    error,
    searchQuery,
    difficultyFilter,
    topicFilter,
    statusFilter,
    currentPage,
    totalPages,
    setSearchQuery,
    setDifficultyFilter,
    setTopicFilter,
    setStatusFilter,
    setCurrentPage,
    refetch,
  } = useCodingChallenges();

  const stats = useMemo(() => {
    const solved    = challenges.filter((c) => c.status === CHALLENGE_STATUS.SOLVED).length;
    const attempted = challenges.filter((c) => c.status === CHALLENGE_STATUS.ATTEMPTED).length;
    const unsolved  = challenges.filter((c) => c.status === CHALLENGE_STATUS.UNSOLVED).length;
    return { solved, attempted, unsolved, total: challenges.length };
  }, [challenges]);

  if (isLoading) return <LoadingSpinner size="lg" label="Loading challenges…" />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <CodingChallengeErrorBoundary>
      <div className="min-h-screen bg-[#0f172a] text-gray-100 px-4 py-8 max-w-7xl mx-auto">
        {/* Page header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <Code2 size={28} className="text-orange-500 drop-shadow-lg" aria-hidden="true" />
            <h1 className="text-4xl font-extrabold text-orange-400 drop-shadow-[0_0_12px_rgba(251,146,60,0.5)]">
              Coding Challenges
            </h1>
          </div>
          <p className="text-gray-400">
            Sharpen your skills with curated algorithmic problems.
          </p>
        </div>

        {/* Stats bar */}
        {challenges.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-slide-up">
            {[
              { label: 'Total',     value: stats.total,    icon: Code2,         color: 'text-gray-300' },
              { label: 'Solved',    value: stats.solved,   icon: CheckCircle2,  color: 'text-teal-400' },
              { label: 'Attempted', value: stats.attempted, icon: Minus,        color: 'text-orange-400' },
              { label: 'Unsolved',  value: stats.unsolved,  icon: Circle,       color: 'text-gray-500' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-gradient-to-br from-white/3 to-transparent border border-white/6 rounded-2xl p-4 text-center backdrop-blur-sm shadow-md">
                <Icon size={18} className={`mx-auto mb-1 ${color}`} aria-hidden="true" />
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="space-y-4 mb-6 animate-slide-up">
          {/* Search */}
          <div className="relative">
            <label htmlFor="challenge-search" className="sr-only">Search challenges</label>
            <input
              id="challenge-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or topic…"
              className="w-full px-4 py-2.5 pl-10 rounded-xl bg-[#0a0a0a] border border-gray-800 text-gray-200 text-sm
                placeholder-gray-600 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/20
                hover:border-gray-700 transition-all duration-200"
            />
            <Code2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" aria-hidden="true" />
          </div>

          {/* Filter chips row */}
          <div className="flex flex-wrap gap-3">
            {/* Difficulty */}
            <div className="flex items-center gap-1.5 flex-wrap" role="group" aria-label="Filter by difficulty">
              {['All', ...Object.values(DIFFICULTY)].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficultyFilter(d)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
                    difficultyFilter === d
                      ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
                      : 'border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300'
                  }`}
                  aria-pressed={difficultyFilter === d}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Status */}
            <div className="flex items-center gap-1.5 flex-wrap" role="group" aria-label="Filter by status">
              {['All', ...Object.values(CHALLENGE_STATUS)].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
                    statusFilter === s
                      ? 'bg-teal-500/20 border-teal-500/50 text-teal-400'
                      : 'border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300'
                  }`}
                  aria-pressed={statusFilter === s}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Topic select */}
          <div className="flex items-center gap-2">
            <label htmlFor="topic-filter" className="text-xs text-gray-500 flex-shrink-0">Topic:</label>
            <select
              id="topic-filter"
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg bg-[#0a0a0a] border border-gray-800 text-gray-300
                focus:outline-none focus:border-orange-500/50 hover:border-gray-700 transition-all duration-200"
            >
              <option value="All">All Topics</option>
              {TOPICS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <SectionHeader
          title={`${filteredChallenges.length} ${filteredChallenges.length === 1 ? 'Challenge' : 'Challenges'}`}
          subtitle={
            filteredChallenges.length !== challenges.length
              ? `Filtered from ${challenges.length} total`
              : totalPages > 1
              ? `Page ${currentPage} of ${totalPages}`
              : undefined
          }
        />

        {/* Grid */}
        {paginatedChallenges.length === 0 ? (
          <EmptyState
            title="No challenges found"
            description="Try adjusting your filters or search query."
            icon="🔍"
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 scrollbar-thin">
              {paginatedChallenges.map((challenge, idx) => (
                <div
                  key={challenge.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <ChallengeCard challenge={challenge} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </CodingChallengeErrorBoundary>
  );
};

export default CodingChallengesPage;
