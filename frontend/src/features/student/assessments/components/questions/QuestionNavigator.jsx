import React from "react";

export default function QuestionNavigator({ onNext, onPrev }) {
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 flex gap-2">
      <button onClick={onPrev} className="px-3 py-1 border rounded">Prev</button>
      <button onClick={onNext} className="px-3 py-1 bg-blue-600 text-white rounded">Next</button>
    </div>
  );
}