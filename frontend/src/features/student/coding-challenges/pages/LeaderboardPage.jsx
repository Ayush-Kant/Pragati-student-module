import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy } from 'lucide-react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import TopCoders from '../components/leaderboard/TopCoders';
import LeaderboardTable from '../components/leaderboard/LeaderboardTable';
import ScoreSummary from '../components/leaderboard/ScoreSummary';
import SectionHeader from '../components/common/SectionHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';

/**
 * Leaderboard page for a specific challenge or global ranking.
 */
const LeaderboardPage = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();

  const { leaderboard, isLoading, error, refetch } = useLeaderboard(challengeId ?? null);

  const currentUserEntry = useMemo(
    () => leaderboard.find((e) => e.isCurrentUser),
    [leaderboard]
  );

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 px-4 py-6 max-w-5xl mx-auto">
      {/* Back link */}
      {challengeId && (
        <button
          type="button"
          onClick={() => navigate(`/student/coding/${challengeId}`)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition-colors mb-6"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to Challenge
        </button>
      )}

      {/* Page header */}
      <div className="flex items-center gap-3 mb-8 animate-fade-in">
        <Trophy size={28} className="text-orange-500" aria-hidden="true" />
        <h1 className="text-4xl font-extrabold text-orange-400 drop-shadow-[0_0_12px_rgba(251,146,60,0.5)]">
          Leaderboard
        </h1>
      </div>

      {isLoading && <LoadingSpinner size="lg" label="Loading leaderboard…" />}

      {!isLoading && error && (
        <ErrorState error={error} onRetry={refetch} />
      )}

      {!isLoading && !error && leaderboard.length === 0 && (
        <EmptyState
          title="No rankings yet"
          description="Be the first to solve this challenge and claim the top spot!"
          icon="🏆"
        />
      )}

      {!isLoading && !error && leaderboard.length > 0 && (
        <div className="space-y-8 animate-slide-up">
          {/* Your standing */}
          {currentUserEntry && <ScoreSummary entry={currentUserEntry} />}

          {/* Podium — aria-label provides the accessible name directly */}
          <section aria-label="Top Performers">
            <SectionHeader title="Top Performers" />
            <TopCoders leaderboard={leaderboard} />
          </section>

          {/* Full table */}
          <section aria-label="All Rankings">
            <SectionHeader
              title="All Rankings"
              subtitle={`${leaderboard.length} participants`}
            />
            <LeaderboardTable leaderboard={leaderboard} />
          </section>
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;
