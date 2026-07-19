export default function AttendanceProgress({ progress = 0 }) {
  const tone = progress >= 75 ? "bg-emerald-500" : progress >= 50 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">Overall Attendance</p>
        <p className="text-sm font-semibold text-slate-900">{progress}%</p>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${tone} transition-all`}
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
