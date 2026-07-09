import { formatDate, calculateDaysLeft } from "../../utils/assignmentHelpers";
import { ASSIGNMENT_STATUS } from "../../constants/assignmentConstants";
import EmptyState from "../common/EmptyState";
import SectionHeader from "../common/SectionHeader";
import { CheckCircle2 } from "lucide-react";
import { AlarmClock } from "lucide-react";
const DeadlineTracker = ({ assignments = [] }) => {
  const pending = assignments
    .filter((a) => a.status === ASSIGNMENT_STATUS.PENDING)
    .map((a) => ({ ...a, daysLeft: calculateDaysLeft(a.dueDate) }))
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
      <SectionHeader
      title={
        <div className="flex items-center gap-2">
            <AlarmClock className="w-5 h-5 text-rose-500" />
            <span>Deadline Tracker</span>
          </div>
        }
      subtitle={`${pending.length} upcoming deadline${pending.length !== 1 ? "s" : ""}`}
      />

      {pending.length === 0 ? (
        <EmptyState
          icon=<CheckCircle2 className="w-5 h-5 text-green-500"/>
          title="No upcoming deadlines"
          description="All pending assignments will be tracked here."
        />
      ) : (
        <div className="flex flex-col gap-2">
          {pending.map((assignment) => {
            const isOverdue = assignment.daysLeft < 0;
            const isDueSoon = !isOverdue && assignment.daysLeft <= 3;

            return (
              <div
                key={assignment.id}
                className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {assignment.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{assignment.subject}</p>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0 ml-3">
                  <span className="text-xs text-gray-400">
                    {formatDate(assignment.dueDate)}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      isOverdue
                        ? "bg-red-100 text-red-600"
                        : isDueSoon
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {isOverdue
                      ? `${Math.abs(assignment.daysLeft)}d overdue`
                      : assignment.daysLeft === 0
                      ? "Due today"
                      : `${assignment.daysLeft}d left`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DeadlineTracker;
