import {
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FolderKanban,
} from "lucide-react";

import {
  getEligibilityCriteria,
  normalizeCompletion,
} from "../../utils/certificateHelpers";

/**
 * Display the three certificate eligibility criteria.
 *
 * Supported eligibility fields:
 * - courseCompletion
 * - assessmentCompletion
 * - projectCompletion
 *
 * @param {Object} props
 * @param {Object|null} props.eligibility
 * @param {string} props.className
 * @returns {JSX.Element|null}
 */
const EligibilityCriteria = ({
  eligibility = null,
  className = "",
}) => {
  if (!eligibility) {
    return null;
  }

  const criteria =
    getEligibilityCriteria(eligibility);

  const criteriaWithIcons = criteria.map(
    (criterion) => {
      let icon = BookOpen;

      if (
        criterion.key === "assessmentCompletion"
      ) {
        icon = ClipboardCheck;
      }

      if (
        criterion.key === "projectCompletion"
      ) {
        icon = FolderKanban;
      }

      return {
        ...criterion,
        icon,
      };
    }
  );

  return (
    <div
      className={`grid grid-cols-1 gap-3 sm:grid-cols-3 ${className}`}
    >
      {criteriaWithIcons.map(
        ({
          key,
          label,
          value,
          icon: Icon,
        }) => {
          const normalizedValue =
            normalizeCompletion(value);

          const completed =
            normalizedValue >= 100;

          return (
            <div
              key={key}
              className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 sm:h-10 sm:w-10">
                  <Icon
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </div>

                {completed ? (
                  <CheckCircle2
                    className="h-4 w-4 shrink-0 text-emerald-600"
                    strokeWidth={2.2}
                    aria-label="Completed"
                  />
                ) : null}
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold leading-5 text-slate-600 sm:text-sm">
                  {label}
                </p>

                <div className="mt-3 flex items-end justify-between gap-3">
                  <p className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    {normalizedValue}%
                  </p>

                  <span
                    className={`text-[10px] font-semibold sm:text-xs ${
                      completed
                        ? "text-emerald-600"
                        : "text-slate-400"
                    }`}
                  >
                    {completed
                      ? "Completed"
                      : "In progress"}
                  </span>
                </div>
              </div>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    completed
                      ? "bg-emerald-500"
                      : "bg-slate-800"
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
    </div>
  );
};

export default EligibilityCriteria;