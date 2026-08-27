/**
 * SkeletonLoader — reusable shimmer skeleton placeholders for loading states.
 *
 * Variants:
 *   'card'    — project/dashboard card skeleton (fixed height, full width)
 *   'line'    — single text-line skeleton (controllable width/height)
 *   'section' — multi-line content block (title + body lines)
 *
 * @param {{
 *   variant?: 'card' | 'line' | 'section',
 *   count?: number,
 *   width?: string,
 *   height?: string,
 *   className?: string,
 * }} props
 */
const SkeletonLoader = ({
  variant = 'line',
  count = 1,
  width = 'w-full',
  height = 'h-4',
  className = '',
}) => {
  // Shared shimmer class — uses the 'shimmer' keyframe defined in tailwind.config.js
  const shimmer =
    'bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%] animate-shimmer rounded-xl';

  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === 'card') {
    return (
      <div
        role="status"
        aria-label="Loading project cards"
        aria-busy="true"
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 ${className}`}
      >
        {items.map((i) => (
          <div key={i} className={`${shimmer} w-full h-48`} />
        ))}
        <span className="sr-only">Loading…</span>
      </div>
    );
  }

  if (variant === 'section') {
    return (
      <div
        className={`space-y-3 ${className}`}
        role="status"
        aria-label="Loading content"
        aria-busy="true"
      >
        {items.map((i) => (
          <div key={i} className="space-y-2">
            {/* Title line */}
            <div className={`${shimmer} h-4 w-1/3`} />
            {/* Body lines */}
            <div className={`${shimmer} h-3 w-full`} />
            <div className={`${shimmer} h-3 w-5/6`} />
            <div className={`${shimmer} h-3 w-4/6`} />
          </div>
        ))}
        <span className="sr-only">Loading…</span>
      </div>
    );
  }

  // Default: 'line'
  return (
    <div
      role="status"
      aria-label="Loading"
      aria-busy="true"
      className={`space-y-2 ${className}`}
    >
      {items.map((i) => (
        <div key={i} className={`${shimmer} ${width} ${height}`} />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
};

export default SkeletonLoader;
