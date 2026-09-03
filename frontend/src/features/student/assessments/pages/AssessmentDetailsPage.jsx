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
  const passingPercentage = Number(assessment.passingPercentage ?? 40);
  const passingMarks = Math.ceil((Number(assessment.totalMarks) || 0) * (passingPercentage / 100));
  const instructions = assessment.instructions || [
    `You have ${assessment.maxAttempts ?? 1} attempt(s) available for this assessment.`,
    "Do not refresh or close the assessment window while attempting the test.",
    "Your answers are saved to the server as you move through the assessment.",
    "The server-side timer is authoritative and the attempt auto-submits at expiry.",
    assessment.reviewEnabled ? "Answer review becomes available according to the assessment review policy." : "Question-level answer review is disabled for this assessment.",
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6 rounded-xl border bg-white p-8 shadow-sm">
      <AssessmentHeader title={assessment.title} category={assessment.type} />
      <p className="text-gray-600">{assessment.description || `${assessment.type} assessment at ${assessment.difficulty} difficulty.`}</p>
      <AssessmentOverview data={{ ...assessment, durationMinutes: duration, category: assessment.type, passingMarks, attempts: assessment.maxAttempts, passingPercentage }} />
      {!hasQuestions && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"><p className="font-semibold">This assessment is not ready yet.</p><p className="mt-1">No questions are currently configured for this assessment, so it cannot be started safely.</p></div>}
      <AssessmentInstructions instructions={instructions} />
      <button type="button" disabled={!hasQuestions} onClick={() => navigate(`/student/assessments/${assessment.id}/attempt`)} className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">{hasQuestions ? "Start Assessment Now" : "Assessment Unavailable"}</button>
    </div>
  );
}
