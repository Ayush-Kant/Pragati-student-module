import React from "react";

export default function QuestionProgress({ current, total }) {
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      <p className="text-sm text-gray-600">Progress: {current} / {total}</p>
    </div>
  );
}