import {
  Activity,
  CalendarCheck2,
  CheckCircle2,
  Gauge,
  ShieldCheck,
} from "lucide-react";

const clamp = (value) => Math.min(100, Math.max(0, Number.isFinite(Number(value)) ? Number(value) : 0));
const percent = (value) => `${Number(clamp(value)).toFixed(0)}%`;

const EligibilityCriteria = ({ eligibility = null, className = "" }) => {
  if (!eligibility) return null;

  const scoreValue = Number(eligibility.score?.value ?? 0);
  const scoreRequired = Number(eligibility.score?.required ?? 70);
  const scoreProgress = scoreRequired > 0 ? clamp((scoreValue / scoreRequired) * 100) : 100;

  const submissionsComplete = Boolean(eligibility.submissions?.complete);
  const requiredCount = Number(eligibility.submissions?.requiredCount ?? 0);
  const submittedCount = Number(eligibility.submissions?.submittedCount ?? 0);
  const submissionsProgress = requiredCount > 0 ? clamp((submittedCount / requiredCount) * 100) : submissionsComplete ? 100 : 0;

  const attendanceValue = Number(eligibility.attendance?.attendancePercent ?? 0);
  const attendanceRequired = Number(eligibility.attendance?.requiredAttendance ?? 60);
  const attendanceProgress = attendanceRequired > 0 ? clamp((attendanceValue / attendanceRequired) * 100) : 100;

  const driveCompleted = Boolean(eligibility.driveCompleted);

  const criteria = [
    {
      key: "score",
      label: "Overall Training Score",
      detail: `${scoreValue.toFixed(1)}% / ${scoreRequired}% required`,
      value: scoreProgress,
      completed: scoreValue >= scoreRequired,
      icon: Gauge,
    },
    {
      key: "submissions",
      label: "Mandatory Activities",
      detail: requiredCount > 0 ? `${submittedCount}/${requiredCount} submitted` : "No mandatory activities configured",
      value: submissionsProgress,
      completed: submissionsComplete,
      icon: Activity,
    },
    {
      key: "attendance",
      label: "Session Attendance",
      detail: `${attendanceValue.toFixed(1)}% / ${attendanceRequired}% required`,
      value: attendanceProgress,
      completed: attendanceValue >= attendanceRequired,
      icon: CalendarCheck2,
    },
    {
      key: "drive",
      label: "Drive Completion",
      detail: eligibility.drive?.name ? `${eligibility.drive.name}: ${eligibility.drive.status || "not completed"}` : "Recruitment drive must be completed",
      value: driveCompleted ? 100 : 0,
      completed: driveCompleted,
      icon: ShieldCheck,
    },
  ];

  return (
    <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {criteria.map(({ key, label, detail, value, completed, icon: Icon }) => (
        <div key={key} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 sm:h-10 sm:w-10">
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.8} aria-hidden="true" />
            </div>
            {completed ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.2} aria-label="Completed" /> : null}
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold leading-5 text-slate-600 sm:text-sm">{label}</p>
            <p className="mt-2 min-h-10 text-[11px] leading-5 text-slate-500 sm:text-xs">{detail}</p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <p className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{percent(value)}</p>
              <span className={`text-[10px] font-semibold sm:text-xs ${completed ? "text-emerald-600" : "text-slate-400"}`}>
                {completed ? "Completed" : "In progress"}
              </span>
            </div>
          </div>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              key={key}
              className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#111827] p-4 shadow-sm sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 sm:h-10 sm:w-10">
                  <Icon
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </div>

                {completed ? (
                  <CheckCircle2
                    className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                    strokeWidth={2.2}
                    aria-label="Completed"
                  />
                ) : null}
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold leading-5 text-slate-600 dark:text-slate-400 sm:text-sm">
                  {label}
                </p>

                <div className="mt-3 flex items-end justify-between gap-3">
                  <p className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                    {normalizedValue}%
                  </p>

                  <span
                    className={`text-[10px] font-semibold sm:text-xs ${
                      completed
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {completed
                      ? "Completed"
                      : "In progress"}
                  </span>
                </div>
              </div>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    completed
                      ? "bg-emerald-500"
                      : "bg-[#4F46E5]"
                  }`}
                  style={{
                    width: `${normalizedValue}%`,
                  }}
                />
              </div>
            </div>
          );
        }
      )}
              className={`h-full rounded-full transition-all duration-500 ${completed ? "bg-emerald-500" : "bg-slate-800"}`}
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default EligibilityCriteria;
