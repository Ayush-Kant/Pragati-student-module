/**
 * ProjectEvaluationPage — standalone evaluation dashboard for a project.
 * Route: /student/projects/:projectId/evaluation
 */

import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Award } from 'lucide-react';
import { useProjectEvaluation } from '../hooks/useProjectEvaluation';
import { useProjectDetails } from '../hooks/useProjectDetails';
import EvaluationSummary from '../components/evaluation/EvaluationSummary';
import CriteriaBreakdown from '../components/evaluation/CriteriaBreakdown';
import EvaluationFeedback from '../components/evaluation/EvaluationFeedback';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';

const ProjectEvaluationPage = () => {
  const { projectId } = useParams();

  const { project, isLoading: projLoading } = useProjectDetails(projectId);
  const { evaluation, isLoading, error, refetch } = useProjectEvaluation(projectId);

  if (isLoading || projLoading)
    return <LoadingSpinner size="lg" label="Loading evaluation…" />;
  if (error)
    return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-100 px-4 py-8 max-w-4xl mx-auto">

      {/* Back link */}
      <Link
        to={`/student/projects/${projectId}`}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-violet-300 transition-colors mb-6"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Back to Project Details
      </Link>

      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Award size={24} className="text-teal-400" aria-hidden="true" />
          <h1 className="text-2xl font-extrabold text-gray-100">Evaluation</h1>
        </div>
        {project && (
          <p className="text-sm text-gray-500 ml-9">{project.title}</p>
        )}
      </div>

      {!evaluation ? (
        <EmptyState
          title="Not yet evaluated"
          description="Your project evaluation will appear here once your mentor completes the review. Check back later."
          icon="⏳"
        />
      ) : (
        <div className="space-y-8 animate-fade-in">
          <EvaluationSummary evaluation={evaluation} />
          <CriteriaBreakdown criteria={evaluation.criteria} />
          <EvaluationFeedback evaluation={evaluation} />
        </div>
      )}
    </div>
  );
};

export default ProjectEvaluationPage;
