import { getProgressBarColor } from "../utils/learningHelpers";

/**
 * Progress bar component with optional label and percentage display.
 *
 * @param {object} props
 * @param {number} props.progress - Progress percentage (0-100).
 * @param {string} [props.label] - Optional label text.
 * @param {boolean} [props.showPercentage=true] - Whether to show percentage text.
 * @returns {JSX.Element}
 */
const ProgressBar = ({ progress, label, showPercentage = true }) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const isCompleted = clampedProgress === 100;
  const isInProgress = clampedProgress > 0 && clampedProgress < 100;

  const barClasses = isCompleted
    ? "bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 shadow-lg shadow-teal-500/30"
    : isInProgress
      ? "bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 shadow-lg shadow-orange-500/30"
      : "bg-[#0a0a0a]";

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1">
          {label && (
            <span className="text-sm font-medium text-gray-300">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-medium text-gray-300">
              {clampedProgress}%
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-[#0a0a0a] rounded-full h-3 overflow-hidden border border-gray-800">
        <div
          className={`${barClasses} h-3 rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${clampedProgress}%` }}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
