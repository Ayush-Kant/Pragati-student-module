import React from "react";

export default function ScoreCard({ score = 0, totalMarks = 100, percentage = 0 }) {
  const safeScore = Number.isFinite(Number(score)) ? Number(score) : 0;
  const safeTotal = Number.isFinite(Number(totalMarks)) ? Number(totalMarks) : 0;
  const safePercentage = Number.isFinite(Number(percentage)) ? Number(percentage) : 0;

  return (
    <section className="w-full rounded-2xl bg-blue-600 p-8 text-center text-white shadow-lg">
      <p className="text-sm font-semibold uppercase tracking-wider text-white/80">
        Overall Score
      </p>
      <div className="mt-2 flex items-center justify-center gap-3">
        <h1 className="text-6xl font-black leading-none">{safePercentage}%</h1>
        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
          Final Result
        </span>
      </div>
      <p className="mt-4 text-sm font-medium text-white/90">
        Obtained {safeScore} out of {safeTotal} total marks
      </p>
    </section>
  );
}
