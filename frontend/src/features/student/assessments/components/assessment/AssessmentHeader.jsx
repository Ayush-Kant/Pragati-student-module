import React from "react";

export default function AssessmentHeader({ title, category }) {
  return (
    <div className="border-b pb-4 mb-4">
      {category && (
        <span className="text-xs font-semibold uppercase px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
          {category}
        </span>
      )}
      <h1 className="text-2xl font-bold text-gray-900 mt-2">{title}</h1>
    </div>
  );
}