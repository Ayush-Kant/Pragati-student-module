import React from "react";

export default function AttemptDetails({ attempt, onClose }) {
  if (!attempt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-bold text-gray-900 text-lg">Attempt Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
        </div>
        
        <div className="space-y-2 text-sm text-gray-700">
          <p><span className="font-semibold">Title:</span> {attempt.title}</p>
          <p><span className="font-semibold">Status:</span> {attempt.status}</p>
          <p><span className="font-semibold">Score:</span> {attempt.score} / {attempt.totalMarks}</p>
          <p><span className="font-semibold">Percentage:</span> {attempt.percentage}%</p>
          <p><span className="font-semibold">Date:</span> {new Date(attempt.submittedAt).toLocaleString()}</p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}