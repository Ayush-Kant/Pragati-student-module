import { memo } from 'react';
import { getVerdictClasses } from '../../utils/codingChallengeHelpers';

/**
 * Badge displaying a submission verdict.
 *
 * @param {{ verdict: string, size?: 'sm'|'md' }} props
 */
const VerdictBadge = memo(({ verdict, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold border shadow-sm ${sizeClasses} ${getVerdictClasses(verdict)}`}
    >
      {verdict}
    </span>
  );
});

VerdictBadge.displayName = 'VerdictBadge';

export default VerdictBadge;
