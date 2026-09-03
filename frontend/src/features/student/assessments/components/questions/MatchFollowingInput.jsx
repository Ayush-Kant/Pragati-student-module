import { useMemo } from "react";

export default function MatchFollowingInput({ value = {}, options = {}, onChange }) {
  const left = Array.isArray(options?.left) ? options.left : [];
  const right = Array.isArray(options?.right) ? options.right : [];

  const current = useMemo(() => (value && typeof value === "object" ? value : {}), [value]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">Match every item on the left with one option on the right.</p>
      {left.length === 0 ? (
        <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No matching options are configured.</div>
      ) : (
        left.map((item, index) => {
          const key = String(item);
          return (
            <div key={`${key}-${index}`} className="grid gap-2 sm:grid-cols-[1fr_1fr] sm:items-center">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">{item}</div>
              <select
                value={current[key] || ""}
                onChange={(event) => onChange({ ...current, [key]: event.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select a match</option>
                {right.map((option, optionIndex) => (
                  <option key={`${String(option)}-${optionIndex}`} value={String(option)}>{option}</option>
                ))}
              </select>
            </div>
          );
        })
      )}
    </div>
  );
}
