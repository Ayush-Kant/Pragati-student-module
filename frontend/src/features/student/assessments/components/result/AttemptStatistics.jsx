import React from "react";

export default function AttemptStatistics({ result }) {
  if (!result) return null;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
      <h4 className="font-semibold text-gray-800">Attempt Metrics</h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="p-3 border rounded-lg bg-gray-50">
          <p className="text-xs text-gray-500">Attempt ID</p>
          <p className="font-mono text-gray-800 text-xs truncate">{result.attemptId}</p>
        </div>
        <div className="p-3 border rounded-lg bg-gray-50">
          <p className="text-xs text-gray-500">Submitted At</p>
          <p className="font-medium text-gray-800 text-xs">
            {new Date(result.submittedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}