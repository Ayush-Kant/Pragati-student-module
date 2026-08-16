import React from "react";
import AssessmentCard from "../components/assessment/AssessmentCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import SectionHeader from "../components/common/SectionHeader";
import { useAssessments } from "../hooks/useAssessments";

export default function AssessmentsPage({ onSelectAssessment }) {
  const { assessments, loading, error } = useAssessments();

  if (loading) return <LoadingSpinner message="Loading available assessments..." />;
  if (error) return <ErrorState message={error} />;
  if (!assessments.length) {
    return <EmptyState title="No Assessments Available" description="Check back later for new test assignments." />;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <SectionHeader
        title="Available Assessments"
        subtitle="Select a test to view details and start your evaluation."
      />
      
      <div className="grid md:grid-cols-2 gap-6">
        {assessments.map((item) => (
          <AssessmentCard key={item.id} item={item} onSelect={onSelectAssessment} />
        ))}
      </div>
    </div>
  );
}