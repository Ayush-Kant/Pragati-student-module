import React from "react";
import AssessmentHeader from "../components/assessment/AssessmentHeader";
import AssessmentInstructions from "../components/assessment/AssessmentInstructions";
import AssessmentOverview from "../components/assessment/AssessmentOverview";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorState from "../components/common/ErrorState";
import { useAssessment } from "../hooks/useAssessment";

export default function AssessmentDetailsPage({ assessmentId, onStart }) {
  const { assessment, loading, error } = useAssessment(assessmentId);

  if (loading) return <LoadingSpinner message="Fetching assessment details..." />;
  if (error || !assessment) return <ErrorState message={error || "Assessment not found"} />;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl border p-8 shadow-sm space-y-6">
      <AssessmentHeader title={assessment.title} category={assessment.category} />
      
      <p className="text-gray-600">{assessment.description}</p>

      <AssessmentOverview data={assessment} />

      <AssessmentInstructions instructions={assessment.instructions} />

      <button
        onClick={() => onStart(assessment)}
        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Start Assessment Now
      </button>
    </div>
  );
}