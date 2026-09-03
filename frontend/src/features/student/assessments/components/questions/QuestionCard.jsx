import React from "react";
import MCQOptions from "./MCQOptions";

export default function QuestionCard({
  question,
  questionIndex,
  selectedOption,
  onSelectOption,
}) {
  if (!question) return null;

  const questionType = String(question.type || "MCQ").toUpperCase();
  const isMcq = questionType === "MCQ";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Q{questionIndex + 1}. {question.text || question.questionText || "Question"}
        </h3>
        <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
          {questionType}
        </span>
      </div>

      {isMcq ? (
        <MCQOptions
          options={question.options}
          selectedOption={selectedOption}
          onSelect={onSelectOption}
        />
      ) : (
        <div className="space-y-4">
          {question.problemStatement && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Problem statement
              </p>
              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {question.problemStatement}
              </p>
            </div>
          )}

          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            This question type is not editable in the MCQ assessment workspace. Use the corresponding student module for its supported interaction.
          </div>
        </div>
      )}
    </div>
  );
}
