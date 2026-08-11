import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSubmissionHistory } from '../hooks/useSubmissionHistory';
import SubmissionHistory from '../components/submission/SubmissionHistory';
import SubmissionStatistics from '../components/submission/SubmissionStatistics';
import SectionHeader from '../components/common/SectionHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';

/**
 * Page displaying submission history for a specific challenge.
 */
const SubmissionHistoryPage = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();

  const { submissions, isLoading, error, refetch } = useSubmissionHistory(challengeId);

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 px-4 py-6 max-w-4xl mx-auto">
      {/* Back link */}
      <button
        type="button"
        onClick={() => navigate(`/student/coding/${challengeId}`)}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition-colors mb-6"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to Challenge
      </button>

      <SectionHeader
        title="Submission History"
        subtitle={
          !isLoading && !error
            ? `${submissions.length} submission${submissions.length !== 1 ? 's' : ''} for this challenge`
            : undefined
        }
      />

      {isLoading && <LoadingSpinner size="md" label="Loading submissions…" />}

      {!isLoading && error && (
        <ErrorState error={error} onRetry={refetch} />
      )}

      {!isLoading && !error && (
        <div className="space-y-6">
          <SubmissionStatistics submissions={submissions} />
          <SubmissionHistory submissions={submissions} />
        </div>
      )}
    </div>
  );
};

export default SubmissionHistoryPage;
