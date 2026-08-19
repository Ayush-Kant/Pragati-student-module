import MilestoneCard from './MilestoneCard';
import EmptyState from '../common/EmptyState';

/**
 * Visual milestone timeline.
 * @param {{ milestones: object[] }} props
 */
const MilestoneTimeline = ({ milestones }) => {
  if (!milestones?.length) {
    return (
      <EmptyState
        title="No milestones defined"
        description="Milestones for this project have not been set up yet."
        icon="🗂️"
      />
    );
  }

  return (
    <div className="relative" aria-label="Milestone timeline">
      {milestones.map((milestone, idx) => (
        <MilestoneCard
          key={milestone.id}
          milestone={milestone}
          isLast={idx === milestones.length - 1}
        />
      ))}
    </div>
  );
};

export default MilestoneTimeline;
