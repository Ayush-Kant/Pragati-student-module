import { ASSIGNMENT_STATUS } from "../../constants/assignmentConstants";
import AssignmentCard from "./AssignmentCard";
import EmptyState from "../common/EmptyState";
import SectionHeader from "../common/SectionHeader";
import { Clock3, PartyPopper } from "lucide-react";

const UpcomingAssignments = ({ assignments = [], onSelect, darkMode = false }) => {
  const upcoming = assignments.filter(
    (a) => a.status === ASSIGNMENT_STATUS.PENDING
  );

  return (
    <div className={`rounded-2xl border shadow-sm p-5 sm:p-6 transition-colors ${darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-100"}`}>
      <SectionHeader
        title={
          <div className="flex items-center gap-2">
            <Clock3 className="w-5 h-5 text-amber-500" />
            <span>Upcoming Assignments</span>
          </div>
        }
        subtitle={`${upcoming.length} pending`}
        darkMode={darkMode}
      />

      {upcoming.length === 0 ? (
        <EmptyState
          icon={<PartyPopper className="w-8 h-8 text-emerald-500" />}
          title="All caught up!"
          description="No pending assignments right now."
          darkMode={darkMode}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {upcoming.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onClick={onSelect}
              darkMode={darkMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingAssignments;
