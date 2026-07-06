import { ASSIGNMENT_STATUS } from "../../constants/assignmentConstants";
import AssignmentCard from "./AssignmentCard";
import EmptyState from "../common/EmptyState";
import SectionHeader from "../common/SectionHeader";

const UpcomingAssignments = ({ assignments = [], onSelect }) => {
  const upcoming = assignments.filter(
    (a) => a.status === ASSIGNMENT_STATUS.PENDING
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
      <SectionHeader
        title="📌 Upcoming Assignments"
        subtitle={`${upcoming.length} pending`}
      />

      {upcoming.length === 0 ? (
        <EmptyState
          icon="🎉"
          title="All caught up!"
          description="No pending assignments right now."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {upcoming.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onClick={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingAssignments;
