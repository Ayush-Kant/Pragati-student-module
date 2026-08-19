import { Calendar } from 'lucide-react';
import MilestoneStatusBadge from './MilestoneStatusBadge';
import ProgressBar from '../common/ProgressBar';
import {
  getMilestoneNodeClasses,
  getMilestoneIcon,
  formatMilestoneDue,
  getMilestoneDueLabel,
  isMilestoneOverdue,
} from '../../utils/milestoneHelpers';

/**
 * Individual milestone card for the timeline.
 * @param {{ milestone: object, isLast: boolean }} props
 */
const MilestoneCard = ({ milestone, isLast = false }) => {
  const nodeClasses = getMilestoneNodeClasses(milestone.status);
  const icon = getMilestoneIcon(milestone.status);
  const overdue = isMilestoneOverdue(milestone);
  const dueLabel = getMilestoneDueLabel(milestone.dueDate, milestone.status);

  return (
    <div className="flex gap-4">
      {/* Timeline column */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${nodeClasses}`}
          aria-hidden="true"
        >
          {icon}
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 mt-1 bg-gray-800 min-h-[24px]" aria-hidden="true" />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 pb-6 ${isLast ? '' : ''}`}>
        <div className="bg-white/2 border border-white/6 rounded-xl p-4 hover:border-violet-500/20 transition-colors">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
            <div>
              <span className="text-xs text-gray-500 mb-0.5 block">
                Milestone {milestone.order}
              </span>
              <h4 className="text-sm font-semibold text-gray-100">{milestone.title}</h4>
            </div>
            <MilestoneStatusBadge status={milestone.status} />
          </div>

          <p className="text-xs text-gray-400 mb-3 leading-relaxed">
            {milestone.description}
          </p>

          {/* Progress */}
          {milestone.progress > 0 && (
            <div className="mb-3">
              <ProgressBar value={milestone.progress} showLabel size="sm" />
            </div>
          )}

          {/* Due date */}
          <div className={`flex items-center gap-1.5 text-xs ${overdue ? 'text-red-400' : 'text-gray-500'}`}>
            <Calendar size={12} aria-hidden="true" />
            <span>{formatMilestoneDue(milestone.dueDate)}</span>
            <span className="text-gray-600">·</span>
            <span className={overdue ? 'text-red-400 font-medium' : 'text-gray-500'}>
              {dueLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneCard;
