import React from "react";

export default function AssessmentInstructions({ instructions = [] }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="font-semibold text-gray-800 mb-2">Instructions</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
        {instructions.map((inst, idx) => (
          <li key={idx}>{inst}</li>
        ))}
      </ul>
    </div>
  );
}