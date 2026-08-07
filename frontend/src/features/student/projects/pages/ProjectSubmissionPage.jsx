import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectSubmission } from '../hooks/useProjectSubmission';
import { useProjectDetails } from '../hooks/useProjectDetails';
import SubmissionForm from '../components/submission/SubmissionForm';
import SubmissionHistory from '../components/submission/SubmissionHistory';
import GitHubRepositoryCard from '../components/submission/GitHubRepositoryCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import { ArrowLeft, Upload } from 'lucide-react';
import { MODULE_ROUTES } from '../constants/projectConstants';

export const ProjectSubmissionPage = ({ embeddedProjectId }) => {
  const params = useParams();
  const navigate = useNavigate();
  const projectId = embeddedProjectId || params.projectId;

  const { project } = useProjectDetails(projectId);
  const {
    submission,
    submissionHistory,
    isLoading,
    isSubmitting,
    error,
    submitProject,
    refetch,
  } = useProjectSubmission(projectId);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner label="Loading submission status..." size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6">
        <ErrorState title="Submission Module Error" message={error} onRetry={refetch} />
      </div>
    );
  }

  const handleSubmit = async (payload) => {
    await submitProject(payload);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {!embeddedProjectId && (
        <>
          <button
            onClick={() => navigate(MODULE_ROUTES.PROJECT_DETAILS(projectId))}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Project Details
          </button>

          <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white">Project Deliverable Submission</h1>
                <p className="text-xs text-slate-400">Upload code archives, documentation, and GitHub repository links for project evaluation.</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* GitHub Repository Quick Link */}
      {project?.githubRepoUrl && (
        <GitHubRepositoryCard
          repoUrl={project.githubRepoUrl}
          commitHash={submission?.commitHash}
        />
      )}

      {/* Submission Form */}
      <SubmissionForm
        onSubmit={handleSubmit}
        defaultGithubRepoUrl={project?.githubRepoUrl || ''}
        isSubmitting={isSubmitting}
      />

      {/* Submission History Log */}
      <SubmissionHistory history={submissionHistory} />
    </div>
  );
};

export default ProjectSubmissionPage;
