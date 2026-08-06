import React from "react";

export default function QuestionPalette({
  totalQuestions,
  currentIndex,
  answers,
  onSelectQuestion
}) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      <h4 className="font-semibold text-gray-700 mb-3">Question Palette</h4>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }).map((_, idx) => {
          const isAnswered = answers[idx] !== undefined;
          const isCurrent = currentIndex === idx;

          let btnStyle = "bg-gray-100 text-gray-600 border-gray-200";
          if (isAnswered) btnStyle = "bg-green-500 text-white border-green-600";
          if (isCurrent) btnStyle += " ring-2 ring-blue-500 font-bold";

          return (
            <button
              key={idx}
              onClick={() => onSelectQuestion(idx)}
              className={`h-10 w-10 rounded-lg border flex items-center justify-center transition ${btnStyle}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}