import { normalizeCompletion } from "../../utils/certificateHelpers";

/**
 * Reusable completion progress bar.
 *
 * @param {Object} props
 * @param {number|string} props.value
 * @param {string} props.label
 * @param {boolean} props.showPercentage
 * @param {boolean} props.compact
 * @param {string} props.className
 * @returns {JSX.Element}
 */
const CompletionProgress = ({
  value = 0,
  label = "Completion Progress",
  showPercentage = true,
  compact = false,
  className = "",
}) => {
  const normalizedValue =
    normalizeCompletion(value);

  const completed =
    normalizedValue >= 100;

  return (
    <div
      className={`w-full ${className}`}
      aria-label={`${label}: ${normalizedValue}%`}
    >
      {(label || showPercentage) && (
        <div
          className={`flex items-center justify-between gap-3 ${
            compact ? "mb-1.5" : "mb-2"
          }`}
        >
          {label ? (
            <span
              className={`min-w-0 truncate font-medium text-slate-600 ${
                compact
                  ? "text-[10px]"
                  : "text-xs sm:text-sm"
              }`}
            >
              {label}
            </span>
          ) : (
            <span />
          )}

          {showPercentage ? (
            <span
              className={`shrink-0 font-bold ${
                compact
                  ? "text-[10px]"
                  : "text-xs sm:text-sm"
              } ${
                completed
                  ? "text-emerald-600"
                  : "text-slate-700"
              }`}
            >
              {normalizedValue}%
            </span>
          ) : null}
        </div>
      )}

      <div
        className={`w-full overflow-hidden rounded-full bg-slate-100 ${
          compact
            ? "h-1.5"
            : "h-2"
        }`}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${
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
};

export default CompletionProgress;