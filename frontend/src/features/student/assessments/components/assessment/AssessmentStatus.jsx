import React from "react";

export default function AssessmentStatus({ status }) {
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      <p className="text-sm text-gray-600">Status: {status || "Available"}</p>
    </div>
  );
}