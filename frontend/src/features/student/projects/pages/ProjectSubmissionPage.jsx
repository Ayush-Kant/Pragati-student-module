import React from "react";
import { useParams, Link } from "react-router-dom";
import { useProjectDetails } from "../hooks/useProjectDetails";
import { useProjectSubmission } from "../hooks/useProjectSubmission";
import SubmissionForm from "../components/submission/SubmissionForm";
import GitHubRepository from "../components/submission/GitHubRepository";
import SubmissionHistory from "../components/submission/SubmissionHistory";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorState from "../components/common/ErrorState";
import SectionHeader from "../components/common/SectionHeader";
import { ArrowLeft } from "lucide-react";

export const ProjectSubmissionPage = () => {
  const { id = "proj-101" } = useParams();

  const { project, loading, error, refetch } = useProjectDetails(id);
  const {
    submitProjectWork,
    submitting,
    uploading,
    validationErrors,
    submittedData,
    submissions,
  } = useProjectSubmission(id);

  if (loading) {
    return <LoadingSpinner label="Preparing submission portal..." size="lg" />;
  }

  if (error || !project) {
    return <ErrorState message={error || "Project not found"} onRetry={refetch} />;
  }

  const handleSubmit = (formData, files) => {
    submitProjectWork(formData, files);
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        to={`/student/projects/${project.id}`}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-surface-500 hover:text-brand-600 dark:text-surface-400 dark:hover:text-brand-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Project Workspace</span>
      </Link>

      <SectionHeader
        title={`Submission Portal — ${project.title}`}
        subtitle="Upload source code archives, deliverables, documentation, and connect your GitHub repository for mentor evaluation."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form */}
        <div className="lg:col-span-2">
          <SubmissionForm
            project={project}
            onSubmit={handleSubmit}
            submitting={submitting}
            uploading={uploading}
            validationErrors={validationErrors}
            submittedSuccess={!!submittedData}
          />
        </div>

        {/* Right Sidebar: Repository & History */}
        <div>
          <GitHubRepository repo={project.githubRepo} />
          <SubmissionHistory submissions={submissions} />
        </div>
      </div>
    </div>
  );
};

export default ProjectSubmissionPage;
