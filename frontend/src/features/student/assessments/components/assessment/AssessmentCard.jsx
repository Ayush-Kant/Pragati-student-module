import React from "react";

export default function AssessmentCard({ item, onSelect }) {
  const attemptsRemaining = Number(item?.attemptsRemaining ?? 0);
  const status = item?.studentStatus || "pending";
  const disabled = status === "expired" || attemptsRemaining <= 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold uppercase text-blue-700">{item?.category || item?.type || "General"}</span>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${status === "in_progress" ? "bg-amber-50 text-amber-700" : status === "expired" ? "bg-rose-50 text-rose-700" : status === "attempted" ? "bg-slate-100 text-slate-600" : "bg-emerald-50 text-emerald-700"}`}>{status.replace("_", " ")}</span>
      </div>
      <h2 className="mt-3 text-xl font-bold text-gray-900">{item?.title}</h2>
      <p className="mt-2 line-clamp-2 text-sm text-gray-600">{item?.description}</p>
      <div className="mt-4 grid grid-cols-3 gap-2 text-sm text-gray-500">
        <span>⏱️ {item?.durationMinutes ?? 0} mins</span>
        <span>❓ {item?.totalQuestions ?? 0}</span>
        <span>🎯 {item?.totalMarks ?? 0}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
        <span className="rounded-full bg-slate-100 px-2.5 py-1">Attempts: {item?.attemptsUsed ?? 0}/{item?.maxAttempts ?? 1}</span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1">Pass: {item?.passingPercentage ?? 40}%</span>
        {item?.reviewEnabled && <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700">Review enabled</span>}
      </div>
      <button type="button" disabled={disabled} onClick={() => onSelect?.(item?.id)} className="mt-5 w-full rounded-lg bg-blue-600 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
        {status === "in_progress" ? "Continue Assessment" : disabled ? "No Attempts Remaining" : "View Assessment"}
      </button>
    </div>
  );
}
