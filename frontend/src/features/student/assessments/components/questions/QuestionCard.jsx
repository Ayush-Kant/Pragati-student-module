import React from "react";

export default function QuestionCard({
  question,
  questionIndex,
  selectedOption,
  onSelectOption
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Q{questionIndex + 1}. {question.text}
      </h3>

      <div className="space-y-3">
        {question.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          return (
            <button
              key={idx}
              onClick={() => onSelectOption(idx)}
              className={`w-full text-left p-4 rounded-lg border transition ${
                isSelected
                  ? "border-blue-600 bg-blue-50 text-blue-900 font-medium"
                  : "border-gray-200 hover:bg-gray-50 text-gray-700"
              }`}
            >
              <span className="inline-block w-6 font-bold">{String.fromCharCode(65 + idx)}.</span>
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}