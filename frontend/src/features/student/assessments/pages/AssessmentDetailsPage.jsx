import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import AssessmentHeader from "../components/assessment/AssessmentHeader";
import AssessmentInstructions from "../components/assessment/AssessmentInstructions";
import AssessmentOverview from "../components/assessment/AssessmentOverview";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorState from "../components/common/ErrorState";
import { useAssessment } from "../hooks/useAssessment";

export default function AssessmentDetailsPage() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { assessment, loading, error } = useAssessment(assessmentId);

  if (loading) return <LoadingSpinner message="Fetching assessment details..." />;
  if (error || !assessment) return <ErrorState message={error || "Assessment not found"} />;

  const duration = assessment.timeLimitMinutes ?? 0;
  const instructions = assessment.instructions || [
    "Do not refresh or close the assessment window while attempting the test.",
    "Your answers are saved as you move through the assessment.",
    "The assessment is submitted automatically when the server-side timer expires.",
    "Only the information permitted by the assessment configuration will be shown before submission.",
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl border p-8 shadow-sm space-y-6">
      <AssessmentHeader title={assessment.title} category={assessment.type} />
      <p className="text-gray-600">
        {assessment.description || `${assessment.type} assessment at ${assessment.difficulty} difficulty.`}
      </p>

      <AssessmentOverview
        data={{
          ...assessment,
          durationMinutes: duration,
          category: assessment.type,
          passingMarks: Math.ceil((assessment.totalMarks || 0) * 0.4),
        }}
      />

      <AssessmentInstructions instructions={instructions} />

      <button
        onClick={() => navigate(`/student/assessments/${assessment.id}/attempt`)}
        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Start Assessment Now
      </button>
    </div>
  );
}
