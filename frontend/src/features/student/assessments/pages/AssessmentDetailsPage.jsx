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
  const questions = Array.isArray(assessment.questions) ? assessment.questions : [];
  const hasQuestions = questions.length > 0;
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

      {!hasQuestions && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-semibold">This assessment is not ready yet.</p>
          <p className="mt-1">
            No questions are currently configured for this assessment, so it cannot be started safely.
            Please return to the assessment list and choose another published assessment.
          </p>
        </div>
      )}

      <AssessmentInstructions instructions={instructions} />

      <button
        type="button"
        disabled={!hasQuestions}
        onClick={() => navigate(`/student/assessments/${assessment.id}/attempt`)}
        className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {hasQuestions ? "Start Assessment Now" : "Assessment Unavailable"}
      </button>
    </div>
  );
}
