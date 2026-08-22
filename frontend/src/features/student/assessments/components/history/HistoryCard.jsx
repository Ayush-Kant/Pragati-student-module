import React from "react";

export default function HistoryCard({ attempt, onViewDetails }) {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm flex items-center justify-between">
      <div>
        <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${
          attempt.status === "passed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {attempt.status}
        </span>
        <h4 className="font-bold text-gray-900 mt-1">{attempt.title}</h4>
        <p className="text-xs text-gray-500 mt-1">
          Score: {attempt.score} / {attempt.totalMarks} ({attempt.percentage}%) • {new Date(attempt.submittedAt).toLocaleDateString()}
        </p>
      </div>
      <button
        onClick={() => onViewDetails?.(attempt.attemptId)}
        className="px-3 py-1.5 border border-gray-300 hover:bg-gray-50 text-xs font-semibold rounded-lg transition"
      >
        Details
      </button>
    </div>
  );
}