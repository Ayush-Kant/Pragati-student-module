import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ScoreCard from "../components/result/ScoreCard";
import ResultSummary from "../components/result/ResultSummary";
import PerformanceChart from "../components/result/PerformanceChart";
import AttemptStatistics from "../components/result/AttemptStatistics";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorState from "../components/common/ErrorState";
import { useAssessmentResult } from "../hooks/useAssessmentResult";

export default function AssessmentResultPage() {
  const { assessmentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const attemptId = new URLSearchParams(location.search).get("attemptId");
  const { result, loading, error } = useAssessmentResult(attemptId);

  if (loading) return <LoadingSpinner message="Loading assessment results..." />;
  if (error || !result) return <ErrorState message={error || "Result unavailable"} />;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-6">
      <ScoreCard score={result.score} totalMarks={result.totalMarks} percentage={result.percentage} passed={result.passed} title={result.title || "Assessment Completed"} />
      <div className="grid gap-6 md:grid-cols-2"><ResultSummary result={result} /><PerformanceChart percentage={result.percentage} /></div>
      <AttemptStatistics result={result} />

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-slate-900">Answer review</h2>
        {result.reviewAvailable ? (
          <>
            <p className="mt-1 text-sm text-slate-500">The assessment has released question-level explanations and correct answers.</p>
            <button type="button" onClick={() => navigate(`/student/assessments/${assessmentId}/review`)} className="mt-4 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700">Review answers</button>
          </>
        ) : (
          <p className="mt-1 text-sm text-slate-500">Question-level answer review is not available yet. It will appear here when the assessment policy allows it.</p>
        )}
      </div>

      <button onClick={() => navigate("/student/assessments")} className="w-full rounded-xl bg-gray-900 py-3.5 font-bold text-white transition hover:bg-gray-800">Back to Assessments</button>
      {assessmentId && <p className="text-center text-xs text-gray-400">Assessment: {assessmentId}</p>}
    </div>
  );
}
