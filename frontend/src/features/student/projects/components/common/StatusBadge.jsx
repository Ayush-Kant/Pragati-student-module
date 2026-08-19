import { getProjectStatusClasses } from '../../utils/projectHelpers';
import { getMilestoneStatusClasses } from '../../utils/milestoneHelpers';

/**
 * Generic status badge.
 *
 * @param {{ status: string, variant?: 'project'|'milestone', className?: string }} props
 */
const StatusBadge = ({ status, variant = 'project', className = '' }) => {
  const classes =
    variant === 'milestone'
      ? getMilestoneStatusClasses(status)
      : getProjectStatusClasses(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes} ${className}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
