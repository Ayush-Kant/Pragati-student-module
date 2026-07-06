import { formatDate, calculateDaysLeft, getStatusColor } from "../../utils/assignmentHelpers";
import EmptyState from "../common/EmptyState";

const AssignmentTable = ({ assignments = [], onRowClick }) => {
  if (assignments.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title="No assignments found"
        description="Try adjusting your filters or search term."
      />
    );
  }

  return (
    <div className="responsive-table-wrap">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 pr-4">
              Assignment
            </th>
            <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 pr-4">
              Subject
            </th>
            <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 pr-4">
              Due Date
            </th>
            <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 pr-4">
              Days Left
            </th>
            <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 pr-4">
              Status
            </th>
            <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3">
              Submission
            </th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => {
            const daysLeft = calculateDaysLeft(assignment.dueDate);
            const isOverdue = daysLeft !== null && daysLeft < 0;

            return (
              <tr
                key={assignment.id}
                onClick={() => onRowClick?.(assignment)}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <td className="py-3.5 pr-4">
                  <p className="font-semibold text-gray-800">{assignment.title}</p>
                </td>
                <td className="py-3.5 pr-4 text-gray-500">{assignment.subject}</td>
                <td className="py-3.5 pr-4 text-gray-500">
                  {formatDate(assignment.dueDate)}
                </td>
                <td className="py-3.5 pr-4">
                  {daysLeft !== null ? (
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        isOverdue
                          ? "bg-red-100 text-red-600"
                          : daysLeft <= 3
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {isOverdue
                        ? `${Math.abs(daysLeft)}d overdue`
                        : daysLeft === 0
                        ? "Today"
                        : `${daysLeft}d`}
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="py-3.5 pr-4">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(
                      assignment.status
                    )}`}
                  >
                    {assignment.status}
                  </span>
                </td>
                <td className="py-3.5">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(
                      assignment.submissionStatus
                    )}`}
                  >
                    {assignment.submissionStatus}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentTable;
