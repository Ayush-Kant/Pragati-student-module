import {
  Award,
  CheckCircle2,
  CircleAlert,
} from "lucide-react";

import EligibilityCriteria from "./EligibilityCriteria";
import CompletionProgress from "./CompletionProgress";
import EligibilityStatus from "./EligibilityStatus";

import {
  calculateEligibilityProgress,
  getEligibilityStatus,
} from "../../utils/certificateHelpers";

/**
 * Display the student's certificate eligibility summary.
 *
 * Supported eligibility fields:
 * - courseCompletion
 * - assessmentCompletion
 * - projectCompletion
 * - eligible
 *
 * @param {Object} props
 * @param {Object|null} props.eligibility
 * @param {Function} props.onRetry
 * @param {boolean} props.loading
 * @param {string|null} props.error
 * @param {string} props.className
 * @returns {JSX.Element|null}
 */
const EligibilityCard = ({
  eligibility = null,
  onRetry,
  loading = false,
  error = null,
  className = "",
}) => {
  if (loading) {
    return (
      <section
        className={`w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-4 shadow-sm sm:p-5 md:p-6 ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800 sm:h-11 sm:w-11" />

          <div className="flex-1">
            <div className="h-4 w-32 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
            <div className="mt-2 h-3 w-52 max-w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>

        <div className="mt-5 h-3 w-full animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-20 animate-pulse rounded-xl bg-slate-50 dark:bg-slate-800/60"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error && !eligibility) {
    return (
      <section
        className={`w-full rounded-2xl border border-red-200 dark:border-red-900/50 bg-white dark:bg-[#111827] p-4 sm:p-5 md:p-6 shadow-xs ${className}`}
        role="alert"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-red-400 sm:h-11 sm:w-11">
            <CircleAlert
              className="h-5 w-5"
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-red-900 dark:text-red-200 sm:text-base">
              Unable to check eligibility
            </h2>

            <p className="mt-1 text-xs leading-5 text-red-700 dark:text-red-300 sm:text-sm">
              {error}
            </p>

            {typeof onRetry === "function" ? (
              <button
                type="button"
                onClick={onRetry}
                className="mt-4 inline-flex min-h-10 items-center justify-center rounded-xl border border-red-200 dark:border-red-900/60 bg-slate-50 dark:bg-slate-900/90 px-4 py-2.5 text-xs font-semibold text-red-700 dark:text-red-300 transition-colors hover:bg-red-50 dark:hover:bg-red-950/50 focus:outline-none focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 focus:ring-offset-2 sm:text-sm cursor-pointer"
              >
                Try again
              </button>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  if (!eligibility) {
    return null;
  }

  const overallProgress =
    calculateEligibilityProgress(
      eligibility
    );

  const eligibilityStatus =
    getEligibilityStatus(
      eligibility
    );

  return (
    <section
      className={`w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-4 shadow-sm sm:p-5 md:p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 sm:h-11 sm:w-11">
            <Award
              className="h-5 w-5 sm:h-5.5 sm:w-5.5"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 sm:text-[11px]">
              Certificate Eligibility
            </p>

            <h2 className="mt-1 text-base font-bold text-slate-900 dark:text-white sm:text-lg">
              Eligibility Progress
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400 sm:text-sm">
              Complete all required criteria to become eligible for your certificate.
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <EligibilityStatus
            eligible={eligibility.eligible}
            status={eligibilityStatus}
          />
        </div>
      </div>

      {/* Overall progress */}
      <div className="mt-6 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Overall Progress
            </p>

            <p className="mt-1 text-sm font-bold text-slate-800 dark:text-white sm:text-base">
              {overallProgress}% complete
            </p>
          </div>

          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {eligibility.eligible
              ? "All requirements completed"
              : "Requirements in progress"}
          </p>
        </div>

        <div className="mt-3">
          <CompletionProgress
            value={overallProgress}
            label=""
            showPercentage={false}
          />
        </div>
      </div>

      {/* Criteria */}
      <div className="mt-5">
        <EligibilityCriteria
          eligibility={eligibility}
        />
      </div>

      {/* Status message */}
      <div
        className={`mt-5 flex items-start gap-3 rounded-xl border px-4 py-3.5 ${
          eligibility.eligible
            ? "border-emerald-100 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/40"
            : "border-amber-100 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/40"
        }`}
      >
        {eligibility.eligible ? (
          <CheckCircle2
            className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400"
            aria-hidden="true"
          />
        ) : (
          <CircleAlert
            className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
            aria-hidden="true"
          />
        )}

        <div className="min-w-0">
          <p
            className={`text-sm font-bold ${
              eligibility.eligible
                ? "text-emerald-800 dark:text-emerald-200"
                : "text-amber-800 dark:text-amber-200"
            }`}
          >
            {eligibility.eligible
              ? "You are eligible for a certificate."
              : "You are not yet eligible for a certificate."}
          </p>

          <p
            className={`mt-1 text-xs leading-5 ${
              eligibility.eligible
                ? "text-emerald-700 dark:text-emerald-300"
                : "text-amber-700 dark:text-amber-300"
            }`}
          >
            {eligibility.eligible
              ? "All required completion criteria have been met."
              : "Complete the remaining requirements to become eligible."}
          </p>
        </div>
      </div>
    </section>
  );
};

export default EligibilityCard;