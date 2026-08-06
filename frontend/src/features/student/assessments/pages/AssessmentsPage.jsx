import React from "react";
import { useAssessments } from "../hooks/useAssessments";

export default function AssessmentsPage({ onSelectAssessment }) {
  const { assessments, loading, error } = useAssessments();

  if (loading) return <div className="p-8 text-center text-gray-500">Loading assessments...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Available Assessments</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {assessments.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <span className="text-xs font-semibold uppercase px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">
              {item.category}
            </span>
            <h2 className="text-xl font-bold text-gray-900 mt-3">{item.title}</h2>
            <p className="text-gray-600 text-sm mt-2">{item.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
              <span>⏱️ {item.durationMinutes} mins</span>
              <span>❓ {item.totalQuestions} Questions</span>
              <span>🎯 {item.totalMarks} Marks</span>
            </div>

            <button
              onClick={() => onSelectAssessment(item.id)}
              className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition"
            >
              View Assessment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}