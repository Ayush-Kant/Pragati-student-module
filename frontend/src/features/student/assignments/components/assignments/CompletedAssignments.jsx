import { ASSIGNMENT_STATUS } from "../../constants/assignmentConstants";
import { formatDate, getStatusColor } from "../../utils/assignmentHelpers";
import EmptyState from "../common/EmptyState";
import SectionHeader from "../common/SectionHeader";

const CompletedAssignments = ({ assignments = [], onSelect }) => {
  const completed = assignments.filter(
    (a) => a.status === ASSIGNMENT_STATUS.COMPLETED
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
      <SectionHeader
        title="✅ Completed Assignments"
        subtitle={`${completed.length} completed`}
      />

      {completed.length === 0 ? (
        <EmptyState
          icon="📚"
          title="No completed assignments"
          description="Completed assignments will appear here."
        />
      ) : (
        <div className="flex flex-col gap-2">
          {completed.map((assignment) => (
            <div
              key={assignment.id}
              onClick={() => onSelect?.(assignment)}
              className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {assignment.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{assignment.subject}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-3">
                <span className="text-xs text-gray-400 hidden sm:block">
                  {formatDate(assignment.dueDate)}
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(
                    assignment.submissionStatus
                  )}`}
                >
                  {assignment.submissionStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedAssignments;
