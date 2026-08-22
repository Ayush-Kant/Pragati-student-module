import React from "react";

export default function ResultSummary({ result }) {
  if (!result) return null;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
      <h3 className="text-lg font-bold text-gray-800">Assessment Summary</h3>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">Score</p>
          <p className="text-xl font-bold text-blue-600">{result.score} / {result.totalMarks}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">Status</p>
          <p className={`text-xl font-bold uppercase ${
            result.status === "passed" ? "text-green-600" : "text-red-600"
          }`}>
            {result.status}
          </p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">Time Spent</p>
          <p className="text-xl font-bold text-gray-800">{result.timeSpentMinutes || 0} mins</p>
        </div>
      </div>
    </div>
  );
}