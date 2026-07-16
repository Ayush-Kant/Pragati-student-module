import { ASSIGNMENT_STATUS } from "../../constants/assignmentConstants";
import { formatDate, getStatusColor } from "../../utils/assignmentHelpers";
import EmptyState from "../common/EmptyState";
import SectionHeader from "../common/SectionHeader";
import { CheckCircle2, ChevronRight, CalendarDays } from "lucide-react";

const CompletedAssignments = ({ assignments = [], onSelect }) => {
  const completed = assignments.filter(
    (a) => a.status === ASSIGNMENT_STATUS.COMPLETED
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
      <SectionHeader
        title={
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>Completed Assignments</span>
          </div>
        }
        subtitle={`${completed.length} completed`}
      />

      {completed.length === 0 ? (
        <EmptyState
          icon={<CheckCircle2 className="w-8 h-8 text-gray-400" />}
          title="No completed assignments"
          description="Completed assignments will appear here."
        />
      ) : (
        <div className="flex flex-col gap-2">
          {completed.map((assignment) => (
            <div
              key={assignment.id}
              onClick={() => onSelect?.(assignment)}
              className="flex items-center justify-between px-4 py-3.5 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-700 transition-colors">
                    {assignment.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    {formatDate(assignment.dueDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0 ml-3">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(
                    assignment.submissionStatus
                  )}`}
                >
                  {assignment.submissionStatus}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedAssignments;
