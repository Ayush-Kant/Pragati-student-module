import React from "react";
import { useParams, Link } from "react-router-dom";
import { useProjectDetails } from "../hooks/useProjectDetails";
import { useProjectAnalytics } from "../hooks/useProjectAnalytics";
import ProgressChart from "../components/analytics/ProgressChart";
import CompletionStatistics from "../components/analytics/CompletionStatistics";
import ActivityTimeline from "../components/analytics/ActivityTimeline";
import PerformanceSummary from "../components/analytics/PerformanceSummary";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorState from "../components/common/ErrorState";
import SectionHeader from "../components/common/SectionHeader";
import { ArrowLeft } from "lucide-react";

export const ProjectAnalyticsPage = () => {
  const { id = "proj-101" } = useParams();

  const { project, loading: projLoading, error: projError, refetch: refetchProj } = useProjectDetails(id);
  const { analytics, loading: analyticsLoading, error: analyticsError, refetch: refetchAnalytics } = useProjectAnalytics(id);

  if (projLoading || analyticsLoading) {
    return <LoadingSpinner label="Generating analytics dashboard..." size="lg" />;
  }

  if (projError || analyticsError || !analytics) {
    return <ErrorState message={projError || analyticsError || "Analytics unavailable"} onRetry={refetchAnalytics} />;
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        to={`/student/projects/${id}`}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-surface-500 hover:text-brand-600 dark:text-surface-400 dark:hover:text-brand-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Project Workspace</span>
      </Link>

      <SectionHeader
        title={`Analytics Dashboard — ${project?.title || "Project Analytics"}`}
        subtitle="Track velocity metrics, task completion rates, activity timelines, and performance evaluations."
      />

      {/* 1. Key Statistics Bar */}
      <CompletionStatistics overview={analytics.overview} />

      {/* 2. Recharts Progress & Task Distribution Charts */}
      <ProgressChart
        progressOverTime={analytics.progressOverTime}
        taskDistribution={analytics.taskDistribution}
      />

      {/* 3. Performance Summary & Activity Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceSummary summary={analytics.performanceSummary} />
        </div>
        <div>
          <ActivityTimeline activities={analytics.activityTimeline} />
        </div>
      </div>
    </div>
  );
};

export default ProjectAnalyticsPage;
