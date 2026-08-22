import React from "react";

export default function AnswerReview({ questions = [], userAnswers = {} }) {
  if (!questions.length) return null;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
      <h3 className="text-lg font-bold text-gray-800">Question Answer Review</h3>
      <div className="space-y-4">
        {questions.map((q, idx) => {
          const selected = userAnswers[idx];
          const isCorrect = selected === q.correctOption;

          return (
            <div key={q.id || idx} className="p-4 rounded-lg border bg-gray-50 space-y-2">
              <p className="font-semibold text-gray-900">
                Q{idx + 1}. {q.text}
              </p>
              <div className="text-sm space-y-1">
                <p className={isCorrect ? "text-green-700 font-medium" : "text-red-600 font-medium"}>
                  Your Answer: {selected !== undefined ? q.options[selected] : "Not Answered"} {isCorrect ? "✓" : "✗"}
                </p>
                {!isCorrect && (
                  <p className="text-gray-700 font-medium">
                    Correct Answer: {q.options[q.correctOption]}
                  </p>
                )}
                {q.explanation && (
                  <p className="text-xs text-gray-500 mt-2 bg-white p-2 rounded border">
                    💡 <span className="font-semibold">Explanation:</span> {q.explanation}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}