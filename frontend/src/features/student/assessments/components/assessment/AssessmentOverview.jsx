import React from "react";

export default function AssessmentOverview({ data }) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
      <div>
        <p className="text-xs text-gray-500 uppercase font-semibold">Duration</p>
        <p className="text-lg font-bold text-gray-800">{data.durationMinutes ?? 0} Mins</p>
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase font-semibold">Total Marks</p>
        <p className="text-lg font-bold text-gray-800">{data.totalMarks ?? 0}</p>
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase font-semibold">Passing Threshold</p>
        <p className="text-lg font-bold text-gray-800">{data.passingMarks ?? 0} Marks</p>
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase font-semibold">Category</p>
        <p className="text-lg font-bold text-blue-600">{data.category || "General"}</p>
      </div>
    </div>
  );
}