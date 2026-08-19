/**
 * ProjectDetailsPage — tabbed detail view for a single project.
 * Route: /student/projects/:projectId
 */

import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Cpu, Wrench } from 'lucide-react';
import { useProjectDetails } from '../hooks/useProjectDetails';
import { useMilestones } from '../hooks/useMilestones';
import { useProjectSubmission } from '../hooks/useProjectSubmission';
import { useProjectEvaluation } from '../hooks/useProjectEvaluation';
import ProjectDetailTabs from '../components/details/ProjectDetailTabs';
import ProjectOverview from '../components/details/ProjectOverview';
import ProjectRequirements from '../components/details/ProjectRequirements';
import ProjectResources from '../components/details/ProjectResources';
import MilestoneTimeline from '../components/milestones/MilestoneTimeline';
import SubmissionForm from '../components/submission/SubmissionForm';
import SubmissionHistory from '../components/submission/SubmissionHistory';
import SubmissionStatusTracker from '../components/submission/SubmissionStatusTracker';
import EvaluationSummary from '../components/evaluation/EvaluationSummary';
import CriteriaBreakdown from '../components/evaluation/CriteriaBreakdown';
import EvaluationFeedback from '../components/evaluation/EvaluationFeedback';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';

const ProjectDetailsPage = () => {
  const { projectId } = useParams();

  const { project, isLoading, error, activeTab, setActiveTab, refetch } =
    useProjectDetails(projectId);

  const { milestones, isLoading: mlLoading } = useMilestones(projectId);

  const {
    submission,
    history,
    submissionState,
    formErrors,
    isLoading: subLoading,
    submit,
  } = useProjectSubmission(projectId, []);

  const { evaluation, isLoading: evalLoading } = useProjectEvaluation(projectId);

  if (isLoading) return <LoadingSpinner size="lg" label="Loading project details…" />;
  if (error)     return <ErrorState error={error} onRetry={refetch} />;
  if (!project)  return <ErrorState error="Project not found." />;

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-100 px-4 py-8 max-w-5xl mx-auto">

      {/* Back link */}
      <Link
        to="/student/projects"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-violet-300 transition-colors mb-6"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Back to Projects
      </Link>

      {/* Workspace + Evaluation quick links */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Link
          to={`/student/projects/${projectId}/workspace`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium
            bg-blue-500/10 text-blue-400 border border-blue-500/20
            hover:bg-blue-500/20 hover:border-blue-500/40 transition-all duration-200"
        >
          <Cpu size={13} aria-hidden="true" />
          Open Workspace
        </Link>
        {evaluation && (
          <Link
            to={`/student/projects/${projectId}/evaluation`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium
              bg-teal-500/10 text-teal-400 border border-teal-500/20
              hover:bg-teal-500/20 hover:border-teal-500/40 transition-all duration-200"
          >
            <Wrench size={13} aria-hidden="true" />
            View Evaluation
          </Link>
        )}
      </div>

      {/* Tabs */}
      <ProjectDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab panels */}
      <div>
        {/* Overview */}
        {activeTab === 'overview' && (
          <div
            id="tabpanel-overview"
            role="tabpanel"
            aria-labelledby="tab-overview"
            className="animate-fade-in"
          >
            <ProjectOverview project={project} />
          </div>
        )}

        {/* Requirements */}
        {activeTab === 'requirements' && (
          <div
            id="tabpanel-requirements"
            role="tabpanel"
            aria-labelledby="tab-requirements"
            className="animate-fade-in"
          >
            <ProjectRequirements project={project} />
            <div className="mt-8">
              <ProjectResources project={project} />
            </div>
          </div>
        )}

        {/* Milestones */}
        {activeTab === 'milestones' && (
          <div
            id="tabpanel-milestones"
            role="tabpanel"
            aria-labelledby="tab-milestones"
            className="animate-fade-in"
          >
            {mlLoading ? (
              <LoadingSpinner label="Loading milestones…" />
            ) : (
              <MilestoneTimeline milestones={milestones} />
            )}
          </div>
        )}

        {/* Submission */}
        {activeTab === 'submission' && (
          <div
            id="tabpanel-submission"
            role="tabpanel"
            aria-labelledby="tab-submission"
            className="animate-fade-in space-y-8"
          >
            <div>
              <h3 className="text-sm font-semibold text-gray-200 mb-4">Submission Progress</h3>
              <SubmissionStatusTracker currentState={submissionState} />
            </div>

            {subLoading ? (
              <LoadingSpinner label="Loading submission…" />
            ) : (
              <>
                <SubmissionForm
                  projectId={projectId}
                  submissionState={submissionState}
                  formErrors={formErrors}
                  existingSubmission={submission}
                  onSubmit={submit}
                />
                <SubmissionHistory history={history} />
              </>
            )}
          </div>
        )}

        {/* Evaluation */}
        {activeTab === 'evaluation' && (
          <div
            id="tabpanel-evaluation"
            role="tabpanel"
            aria-labelledby="tab-evaluation"
            className="animate-fade-in space-y-8"
          >
            {evalLoading ? (
              <LoadingSpinner label="Loading evaluation…" />
            ) : !evaluation ? (
              <EmptyState
                title="Not yet evaluated"
                description="Your project evaluation will appear here once your mentor completes the review."
                icon="⏳"
              />
            ) : (
              <>
                <EvaluationSummary evaluation={evaluation} />
                <CriteriaBreakdown criteria={evaluation.criteria} />
                <EvaluationFeedback evaluation={evaluation} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
