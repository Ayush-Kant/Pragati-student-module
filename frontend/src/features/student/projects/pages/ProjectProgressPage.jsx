import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMilestones } from '../hooks/useMilestones';
import { useProjectAnalytics } from '../hooks/useProjectAnalytics';
import MilestoneCard from '../components/milestone/MilestoneCard';
import ProgressChart from '../components/analytics/ProgressChart';
import CompletionStatistics from '../components/analytics/CompletionStatistics';
import ActivityTimeline from '../components/analytics/ActivityTimeline';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import { ArrowLeft, Target } from 'lucide-react';
import { MODULE_ROUTES } from '../constants/projectConstants';

export const ProjectProgressPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { milestones, isLoading: isMsLoading, error: msError, updateTaskProgress, refetch: refetchMs } = useMilestones(projectId);
  const { analytics, isLoading: isAnaLoading, error: anaError } = useProjectAnalytics(projectId);

  if (isMsLoading || isAnaLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner label="Loading project progress tracking metrics..." size="lg" />
      </div>
    );
  }

  if (msError || anaError) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <ErrorState
          title="Progress Data Unavailable"
          message={msError || anaError}
          onRetry={refetchMs}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Header */}
      <button
        onClick={() => navigate(MODULE_ROUTES.PROJECT_DETAILS(projectId))}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Project Details
      </button>

      <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 mb-8 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Project Progress & Performance Dashboard</h1>
            <p className="text-xs text-slate-400">Milestone checklist tracking and real-time velocity analytics.</p>
          </div>
        </div>
      </div>

      {/* Analytics High Level Cards */}
      {analytics && (
        <div className="mb-8 space-y-6">
          <CompletionStatistics analytics={analytics} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ProgressChart analytics={analytics} />
            </div>
            <div>
              <ActivityTimeline activities={analytics.activityLog} />
            </div>
          </div>
        </div>
      )}

      {/* Milestone List Section */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-100 pb-2 border-b border-slate-700/60">
          Project Milestones & Task Breakdown
        </h2>
        {milestones.map((milestone) => (
          <MilestoneCard
            key={milestone.id}
            milestone={milestone}
            onTaskStatusChange={updateTaskProgress}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectProgressPage;
