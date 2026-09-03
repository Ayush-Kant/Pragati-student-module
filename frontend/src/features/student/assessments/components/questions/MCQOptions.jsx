import React from "react";

export default function MCQOptions({ options, selectedOption, onSelect }) {
  const normalizedOptions = Array.isArray(options) ? options : [];

  if (normalizedOptions.length === 0) {
    return (
      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        No multiple-choice options are configured for this question.
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-2">
      {normalizedOptions.map((option, idx) => (
        <button
          key={`${String(option)}-${idx}`}
          type="button"
          onClick={() => onSelect?.(idx)}
          className={`w-full rounded-lg border p-3 text-left transition ${
            selectedOption === idx
              ? "border-blue-600 bg-blue-50 font-medium text-blue-900"
              : "border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <span className="mr-2 font-bold">{String.fromCharCode(65 + idx)}.</span>
          {String(option)}
        </button>
      ))}
    </div>
  );
}
