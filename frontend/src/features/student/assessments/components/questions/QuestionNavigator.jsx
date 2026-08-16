import React from "react";

export default function QuestionNavigator({
  onNext,
  onPrev,
  onSubmit,
  isFirst = false,
  isLast = false
}) {
  return (
    <div className="flex justify-between items-center pt-2">
      <button
        disabled={isFirst}
        onClick={onPrev}
        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
      >
        Previous
      </button>

      {isLast ? (
        <button
          onClick={onSubmit}
          className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
        >
          Submit Test
        </button>
      ) : (
        <button
          onClick={onNext}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Next
        </button>
      )}
    </div>
  );
}