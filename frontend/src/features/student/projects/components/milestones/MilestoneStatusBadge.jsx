import { getMilestoneStatusClasses } from '../../utils/milestoneHelpers';

/**
 * Small inline milestone status badge.
 * @param {{ status: string, className?: string }} props
 */
const MilestoneStatusBadge = ({ status, className = '' }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMilestoneStatusClasses(status)} ${className}`}
  >
    {status}
  </span>
);

export default MilestoneStatusBadge;
