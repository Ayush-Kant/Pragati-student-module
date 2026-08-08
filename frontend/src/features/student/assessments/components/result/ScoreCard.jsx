import React from "react";

export default function ScoreCard({ score = 0, totalMarks = 100, percentage = 0 }) {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 rounded-2xl text-center shadow-lg">
      <p className="text-sm font-medium opacity-80 uppercase tracking-wider">Overall Score</p>
      <h1 className="text-6xl font-black mt-2">{percentage}%</h1>
      <p className="text-sm mt-3 opacity-90 font-medium">
        Obtained {score} out of {totalMarks} total marks
      </p>
    </div>
  );
}