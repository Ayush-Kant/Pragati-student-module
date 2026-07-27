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
  const bgColor = getProgressBarColor(progress);
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1">
          {label && (
            <span className="text-sm font-medium text-slate-700">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-medium text-slate-600">
              {clampedProgress}%
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
        <div
          className={`${bgColor} h-2.5 rounded-full transition-all duration-500 ease-out`}
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
