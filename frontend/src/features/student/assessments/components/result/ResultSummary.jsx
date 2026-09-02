import React from "react";

export default function ResultSummary({ result }) {
  if (!result) return null;

  const status = String(result.status || "submitted").toLowerCase();
  const statusClass =
    result.passed === true || status === "passed"
      ? "text-emerald-600"
      : result.passed === false || status === "failed"
        ? "text-rose-600"
        : "text-amber-600";

  const statusLabel =
    status === "auto_submitted" ? "Auto Submitted" : status.replaceAll("_", " ");

  return (
    <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-800">Assessment Summary</h3>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-xs text-gray-500">Score</p>
          <p className="text-xl font-bold text-blue-600">
            {result.score} / {result.totalMarks}
          </p>
        </div>
        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-xs text-gray-500">Status</p>
          <p className={`text-sm font-bold uppercase ${statusClass}`}>{statusLabel}</p>
        </div>
        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-xs text-gray-500">Time Spent</p>
          <p className="text-xl font-bold text-gray-800">
            {result.timeSpentMinutes || 0} mins
          </p>
        </div>
      </div>
    </div>
  );
}
