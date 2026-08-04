import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProjectDetails } from '../hooks/useProjectDetails';
import { useMilestones } from '../hooks/useMilestones';
import { useProjectAnalytics } from '../hooks/useProjectAnalytics';
import ProjectHeader from '../components/project/ProjectHeader';
import ProjectOverview from '../components/project/ProjectOverview';
import ProjectDescription from '../components/project/ProjectDescription';
import ProjectMembers from '../components/project/ProjectMembers';
import ProjectTimeline from '../components/project/ProjectTimeline';
import MentorFeedback from '../components/review/MentorFeedback';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';

// Milestone & Analytics Component imports
import MilestoneCard from '../components/milestone/MilestoneCard';
import ProgressChart from '../components/analytics/ProgressChart';
import CompletionStatistics from '../components/analytics/CompletionStatistics';
import ActivityTimeline from '../components/analytics/ActivityTimeline';
import ProjectSubmissionPage from './ProjectSubmissionPage';

export const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  const { project, feedback, isLoading: isProjectLoading, error: projectError, refetch } = useProjectDetails(projectId);
  const { milestones, updateTaskProgress } = useMilestones(projectId);
  const { analytics } = useProjectAnalytics(projectId);

  if (isProjectLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner label="Loading project details..." size="lg" />
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <ErrorState
          title="Project Not Found"
          message={projectError || 'The requested project could not be retrieved.'}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Header with Navigation Tabs */}
      <ProjectHeader project={project} activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <ProjectOverview project={project} />
          <ProjectDescription description={project.description} />
          <ProjectMembers members={project.teamMembers} mentor={project.mentor} />
          <ProjectTimeline startDate={project.startDate} dueDate={project.dueDate} milestones={milestones} />
        </div>
      )}

      {/* Tab 2: Milestones & Task Tracking */}
      {activeTab === 'milestones' && (
        <div className="space-y-6">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-md mb-6">
            <h2 className="text-xl font-extrabold text-white mb-1">Project Milestone Checklist</h2>
            <p className="text-xs text-slate-400">Update task status to automatically recalculate milestone completion percentages.</p>
          </div>
          {milestones.length === 0 ? (
            <p className="text-slate-400 text-sm italic">No milestones defined for this project yet.</p>
          ) : (
            milestones.map((milestone) => (
              <MilestoneCard
                key={milestone.id}
                milestone={milestone}
                onTaskStatusChange={updateTaskProgress}
              />
            ))
          )}
        </div>
      )}

      {/* Tab 3: Deliverable Submission */}
      {activeTab === 'submission' && (
        <ProjectSubmissionPage embeddedProjectId={projectId} />
      )}

      {/* Tab 4: Mentor Feedback & Evaluation */}
      {activeTab === 'feedback' && (
        <MentorFeedback feedback={feedback} />
      )}

      {/* Tab 5: Analytics */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-6">
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
    </div>
  );
};

export default ProjectDetailsPage;
