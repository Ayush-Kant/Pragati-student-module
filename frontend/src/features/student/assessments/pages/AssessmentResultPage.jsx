import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ScoreCard from "../components/result/ScoreCard";
import ResultSummary from "../components/result/ResultSummary";
import PerformanceChart from "../components/result/PerformanceChart";
import AnswerReview from "../components/result/AnswerReview";
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
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <ScoreCard
        score={result.score}
        totalMarks={result.totalMarks}
        percentage={result.percentage}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <ResultSummary result={result} />
        <PerformanceChart percentage={result.percentage} />
      </div>

      <AttemptStatistics result={result} />

      <AnswerReview questions={result.questions || []} userAnswers={result.answers || []} />

      <button
        onClick={() => navigate("/student/assessments")}
        className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition"
      >
        Back to Assessments
      </button>

      {assessmentId && (
        <p className="text-center text-xs text-gray-400">
          Assessment: {assessmentId}
        </p>
      )}
    </div>
  );
}
