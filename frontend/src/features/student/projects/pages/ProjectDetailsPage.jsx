import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useProjectDetails } from "../hooks/useProjectDetails";
import { useMilestones } from "../hooks/useMilestones";
import { useProjectReviews } from "../hooks/useProjectReviews";
import ProjectHeader from "../components/project/ProjectHeader";
import ProjectOverview from "../components/project/ProjectOverview";
import ProjectDescription from "../components/project/ProjectDescription";
import ProjectMembers from "../components/project/ProjectMembers";
import MilestoneCard from "../components/milestone/MilestoneCard";
import MentorReview from "../components/review/MentorReview";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorState from "../components/common/ErrorState";
import SectionHeader from "../components/common/SectionHeader";
import { CheckCircle2, MessageSquare } from "lucide-react";

export const ProjectDetailsPage = () => {
  const { id = "proj-101" } = useParams();

  const { project, loading: projLoading, error: projError, refetch: refetchProj } = useProjectDetails(id);
  const { milestones, loading: msLoading, toggleTaskChecklist } = useMilestones(id);
  const { reviews, loading: revLoading, addCommentReply } = useProjectReviews(id);

  const [activeTab, setActiveTab] = useState("milestones"); // "milestones" | "reviews"

  if (projLoading || msLoading) {
    return <LoadingSpinner label="Loading project workspace..." size="lg" />;
  }

  if (projError || !project) {
    return <ErrorState message={projError || "Project not found"} onRetry={refetchProj} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <ProjectHeader project={project} />

      {/* Top Quick Stats */}
      <ProjectOverview project={project} milestones={milestones} />

      {/* Main Grid: Info + Team */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProjectDescription description={project.description} tags={project.tags} />
        </div>
        <div>
          <ProjectMembers members={project.members} mentor={project.mentor} />
        </div>
      </div>

      {/* Tab Switcher: Milestones vs Mentor Reviews */}
      <div className="border-b border-surface-200 dark:border-surface-700 flex space-x-6">
        <button
          onClick={() => setActiveTab("milestones")}
          className={`pb-3 text-sm font-bold transition-all flex items-center space-x-2 border-b-2 ${
            activeTab === "milestones"
              ? "border-brand-600 text-brand-600 dark:text-brand-400"
              : "border-transparent text-surface-500 hover:text-surface-800 dark:hover:text-surface-200"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Milestones & Tasks ({milestones.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("reviews")}
          className={`pb-3 text-sm font-bold transition-all flex items-center space-x-2 border-b-2 ${
            activeTab === "reviews"
              ? "border-brand-600 text-brand-600 dark:text-brand-400"
              : "border-transparent text-surface-500 hover:text-surface-800 dark:hover:text-surface-200"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Mentor Evaluation & Review</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "milestones" ? (
        <div className="space-y-4">
          <SectionHeader
            title="Project Roadmap & Milestones"
            subtitle="Track progress, update subtask checklists, and manage team deliverables."
          />

          {milestones.map((milestone) => (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              onToggleTaskChecklist={toggleTaskChecklist}
            />
          ))}
        </div>
      ) : (
        <div>
          {revLoading ? (
            <LoadingSpinner label="Loading mentor reviews..." />
          ) : (
            <MentorReview reviews={reviews} onAddReply={addCommentReply} />
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsPage;
