import React from "react";

export default function ScoreCard({
  score = 0,
  totalMarks = 100,
  percentage = 0,
  passed = null,
  title = "Assessment Completed",
}) {
  const safeScore = Number.isFinite(Number(score)) ? Number(score) : 0;
  const safeTotal = Number.isFinite(Number(totalMarks)) ? Number(totalMarks) : 0;
  const safePercentage = Math.max(
    0,
    Math.min(100, Number.isFinite(Number(percentage)) ? Number(percentage) : 0),
  );

  const statusLabel =
    passed === true ? "Passed" : passed === false ? "Needs Improvement" : "Submitted";

  const statusTone =
    passed === true
      ? "bg-emerald-400/20 text-emerald-50 ring-1 ring-inset ring-emerald-200/30"
      : passed === false
        ? "bg-rose-400/20 text-rose-50 ring-1 ring-inset ring-rose-200/30"
        : "bg-white/15 text-white ring-1 ring-inset ring-white/20";

  return (
    <section className="relative isolate overflow-hidden rounded-3xl bg-blue-700 text-white shadow-xl">
      <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-28 left-1/4 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/20" />

      <div className="relative px-6 py-7 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 md:max-w-[45%]">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100/80">
              Result Summary
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 max-w-md text-sm leading-6 text-blue-100/85">
              Your assessment has been recorded successfully. Review your performance below.
            </p>
          </div>

          <div className="flex items-center gap-4 self-start md:self-auto">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white/25 bg-white/10 shadow-inner sm:h-28 sm:w-28">
              <div className="text-center">
                <div className="text-3xl font-black leading-none sm:text-4xl">
                  {Math.round(safePercentage)}%
                </div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-blue-100">
                  Score
                </div>
              </div>
            </div>

            <div>
              <span
                className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${statusTone}`}
              >
                {statusLabel}
              </span>
              <p className="mt-2 text-sm text-blue-100/85">
                {safeScore} / {safeTotal} marks
              </p>
            </div>
          </div>
        </div>

        <div className="mt-7 border-t border-white/10 pt-5">
          <div className="flex items-center justify-between text-xs font-semibold text-blue-100/80">
            <span>Overall performance</span>
            <span>{Math.round(safePercentage)}%</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-black/15">
            <div
              className="h-full rounded-full bg-white/90 shadow-sm transition-all duration-500"
              style={{ width: `${safePercentage}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
