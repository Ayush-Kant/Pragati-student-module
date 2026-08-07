import React from "react";

export default function MCQOptions({ options = [], selectedOption, onSelect }) {
  return (
    <div className="space-y-2 mt-4">
      {options.map((option, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(idx)}
          className={`w-full text-left p-3 rounded-lg border transition ${
            selectedOption === idx
              ? "border-blue-600 bg-blue-50 text-blue-900 font-medium"
              : "border-gray-200 hover:bg-gray-50 text-gray-700"
          }`}
        >
          <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
          {option}
        </button>
      ))}
    </div>
  );
}