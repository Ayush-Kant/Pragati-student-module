import { clampProgress, getProgressColor } from '../../utils/projectHelpers';

/**
 * Animated progress bar.
 *
 * @param {{
 *   value: number,
 *   showLabel?: boolean,
 *   size?: 'sm'|'md'|'lg',
 *   colorOverride?: string,
 *   className?: string,
 * }} props
 */
const ProgressBar = ({
  value,
  showLabel = true,
  size = 'md',
  colorOverride,
  className = '',
}) => {
  const pct = clampProgress(value);
  const color = colorOverride ?? getProgressColor(pct);
  const heights = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-end mb-1">
          <span className="text-xs font-medium text-gray-400">{pct}%</span>
        </div>
      )}
      <div
        className={`w-full ${heights[size]} rounded-full bg-gray-800 overflow-hidden`}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`${heights[size]} rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
