import React from "react";
import { useAssessment } from "../hooks/useAssessment";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function AssessmentDetailsPage({ assessmentId, onStart }) {
  const { assessment, loading, error } = useAssessment(assessmentId);

  if (loading) return <LoadingSpinner message="Fetching assessment details..." />;
  if (error || !assessment) return <div className="p-6 text-red-500">Failed to load assessment.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl border p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900">{assessment.title}</h1>
      <p className="text-gray-600 mt-2">{assessment.description}</p>

      <div className="grid grid-cols-3 gap-4 my-6 p-4 bg-gray-50 rounded-lg text-center">
        <div><p className="text-xs text-gray-500">Duration</p><p className="font-bold">{assessment.durationMinutes} mins</p></div>
        <div><p className="text-xs text-gray-500">Total Marks</p><p className="font-bold">{assessment.totalMarks}</p></div>
        <div><p className="text-xs text-gray-500">Passing Marks</p><p className="font-bold">{assessment.passingMarks}</p></div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-2">Instructions:</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
          {assessment.instructions?.map((inst, idx) => (
            <li key={idx}>{inst}</li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => onStart(assessment)}
        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Start Assessment Now
      </button>
    </div>
  );
}