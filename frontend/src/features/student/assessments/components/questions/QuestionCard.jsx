import React from "react";
import MCQOptions from "./MCQOptions";

export default function QuestionCard({
  question,
  questionIndex,
  selectedOption,
  onSelectOption
}) {
  if (!question) return null;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Q{questionIndex + 1}. {question.text}
      </h3>

      <MCQOptions
        options={question.options}
        selectedOption={selectedOption}
        onSelect={onSelectOption}
      />
    </div>
  );
}