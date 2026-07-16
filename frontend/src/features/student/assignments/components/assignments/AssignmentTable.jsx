import {
  formatDate,
  calculateDaysLeft,
  getStatusColor,
} from "../../utils/assignmentHelpers";
import EmptyState from "../common/EmptyState";
import { ClipboardList, Eye } from "lucide-react";

const AssignmentTable = ({ assignments = [], onRowClick }) => {
  if (assignments.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <EmptyState
          icon={<ClipboardList className="w-8 h-8 text-gray-300" />}
          title="No assignments found"
          description="Try adjusting your filters or search term."
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="responsive-table-wrap">
        <table className="w-full">
          {/* GitHub / Linear style header — small, uppercase, wide tracking */}
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80">
              <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-widest py-3 px-5">
                Assignment
              </th>
              <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-widest py-3 px-4">
                Subject
              </th>
              <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-widest py-3 px-4">
                Due Date
              </th>
              <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-widest py-3 px-4">
                Deadline
              </th>
              <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-widest py-3 px-4">
                Status
              </th>
              <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-widest py-3 px-4">
                Submission
              </th>
              <th className="py-3 px-5 w-12" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {assignments.map((assignment) => {
              const daysLeft = calculateDaysLeft(assignment.dueDate);
              const isOverdue = daysLeft !== null && daysLeft < 0;

              return (
                <tr
                  key={assignment.id}
                  onClick={() => onRowClick?.(assignment)}
                  className="hover:bg-blue-50/30 transition-colors duration-150 cursor-pointer group"
                >
                  <td className="py-3.5 px-5">
                    <p className="text-sm font-semibold text-gray-800 tracking-tight group-hover:text-blue-700 transition-colors">
                      {assignment.title}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-medium text-gray-500">
                      {assignment.subject}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs text-gray-500">
                      {formatDate(assignment.dueDate)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {daysLeft !== null ? (
                      <span
                        className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                          isOverdue
                            ? "bg-red-50 text-red-600 border-red-100"
                            : daysLeft <= 3
                            ? "bg-amber-50 text-amber-700 border-amber-100"
                            : "bg-gray-50 text-gray-500 border-gray-100"
                        }`}
                      >
                        {isOverdue
                          ? `${Math.abs(daysLeft)}d overdue`
                          : daysLeft === 0
                          ? "Today"
                          : `${daysLeft}d left`}
                      </span>
                    ) : (
                      <span className="text-gray-300 text-sm">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${getStatusColor(
                        assignment.status
                      )}`}
                    >
                      {assignment.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${getStatusColor(
                        assignment.submissionStatus
                      )}`}
                    >
                      {assignment.submissionStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-blue-600 hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100 duration-150">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignmentTable;
