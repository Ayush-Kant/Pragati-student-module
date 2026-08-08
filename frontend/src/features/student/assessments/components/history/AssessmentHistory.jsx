import React from "react";
import HistoryCard from "./HistoryCard";
import LoadingSpinner from "../common/LoadingSpinner";
import EmptyState from "../common/EmptyState";
import ErrorState from "../common/ErrorState";
import { useAssessmentHistory } from "../../hooks/useAssessmentHistory";

export default function AssessmentHistory({ onViewDetails }) {
  const { history, loading, error } = useAssessmentHistory();

  if (loading) return <LoadingSpinner message="Fetching attempt history..." />;
  if (error) return <ErrorState message={error} />;
  if (!history.length) return <EmptyState title="No Attempt History" description="You have not completed any assessments yet." />;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800">Previous Attempts</h3>
      <div className="space-y-3">
        {history.map((item) => (
          <HistoryCard key={item.attemptId} attempt={item} onViewDetails={onViewDetails} />
        ))}
      </div>
    </div>
  );
}