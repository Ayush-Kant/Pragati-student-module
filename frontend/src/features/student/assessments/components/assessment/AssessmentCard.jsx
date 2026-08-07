import React from "react";

export default function AssessmentCard({ item, onSelect }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <span className="text-xs font-semibold uppercase px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">
        {item?.category || "General"}
      </span>
      <h2 className="text-xl font-bold text-gray-900 mt-3">{item?.title}</h2>
      <p className="text-gray-600 text-sm mt-2">{item?.description}</p>
      
      <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
        <span>⏱️ {item?.durationMinutes} mins</span>
        <span>❓ {item?.totalQuestions} Questions</span>
        <span>🎯 {item?.totalMarks} Marks</span>
      </div>

      <button
        onClick={() => onSelect(item.id)}
        className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition"
      >
        View Assessment
      </button>
    </div>
  );
}