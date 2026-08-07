import React from "react";

export default function AssessmentResultPage({ result, onBack }) {
  if (!result) return <div className="p-6 text-center text-gray-500">No result available.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl border p-8 shadow-sm text-center">
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
        result.status === "passed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}>
        {result.status}
      </span>

      <h1 className="text-2xl font-bold text-gray-900 mt-3">{result.title}</h1>
      
      <div className="my-8">
        <p className="text-5xl font-extrabold text-blue-600">{result.percentage}%</p>
        <p className="text-sm text-gray-500 mt-2">Score: {result.score} / {result.totalMarks}</p>
      </div>

      <button
        onClick={onBack}
        className="bg-gray-800 text-white px-6 py-2.5 rounded-lg hover:bg-gray-900 transition"
      >
        Back to Assessments
      </button>
    </div>
  );
}