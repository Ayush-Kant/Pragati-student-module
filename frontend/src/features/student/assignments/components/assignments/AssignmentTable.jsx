import {
  formatDate,
  calculateDaysLeft,
  getStatusColor,
} from "../../utils/assignmentHelpers";
import EmptyState from "../common/EmptyState";
import { ClipboardList, Eye } from "lucide-react";

const AssignmentTable = ({ assignments = [], onRowClick, darkMode = false }) => {
  if (assignments.length === 0) {
    return (
      <div className={`rounded-2xl border shadow-sm ${darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-100"}`}>
        <EmptyState
          icon={<ClipboardList className={`w-8 h-8 ${darkMode ? "text-slate-600" : "text-gray-300"}`} />}
          title="No assignments found"
          description="Try adjusting your filters or search term."
          darkMode={darkMode}
        />
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border shadow-sm overflow-hidden transition-colors ${darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-100"}`}>
      <div className="responsive-table-wrap">
        <table className="w-full">
          {/* GitHub / Linear style header — small, uppercase, wide tracking */}
          <thead>
            <tr className={`border-b ${darkMode ? "border-slate-700 bg-slate-800" : "border-gray-100 bg-gray-50/80"}`}>
              <th className={`text-left text-[11px] font-semibold uppercase tracking-widest py-3 px-5 ${darkMode ? "text-slate-500" : "text-gray-400"}`}>
                Assignment
              </th>
              <th className={`text-left text-[11px] font-semibold uppercase tracking-widest py-3 px-4 ${darkMode ? "text-slate-500" : "text-gray-400"}`}>
                Subject
              </th>
              <th className={`text-left text-[11px] font-semibold uppercase tracking-widest py-3 px-4 ${darkMode ? "text-slate-500" : "text-gray-400"}`}>
                Due Date
              </th>
              <th className={`text-left text-[11px] font-semibold uppercase tracking-widest py-3 px-4 ${darkMode ? "text-slate-500" : "text-gray-400"}`}>
                Deadline
              </th>
              <th className={`text-left text-[11px] font-semibold uppercase tracking-widest py-3 px-4 ${darkMode ? "text-slate-500" : "text-gray-400"}`}>
                Status
              </th>
              <th className={`text-left text-[11px] font-semibold uppercase tracking-widest py-3 px-4 ${darkMode ? "text-slate-500" : "text-gray-400"}`}>
                Submission
              </th>
              <th className="py-3 px-5 w-12" />
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? "divide-slate-700/60" : "divide-gray-50"}`}>
            {assignments.map((assignment) => {
              const daysLeft = calculateDaysLeft(assignment.dueDate);
              const isOverdue = daysLeft !== null && daysLeft < 0;

              return (
                <tr
                  key={assignment.id}
                  onClick={() => onRowClick?.(assignment)}
                  className={`transition-colors duration-150 cursor-pointer group ${
                    darkMode
                      ? "hover:bg-blue-900/10"
                      : "hover:bg-blue-50/30"
                  }`}
                >
                  <td className="py-3.5 px-5">
                    <p className={`text-sm font-semibold tracking-tight transition-colors ${darkMode ? "text-slate-200 group-hover:text-blue-400" : "text-gray-800 group-hover:text-blue-700"}`}>
                      {assignment.title}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-xs font-medium ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                      {assignment.subject}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-xs ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                      {formatDate(assignment.dueDate)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {daysLeft !== null ? (
                      <span
                        className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                          isOverdue
                            ? darkMode
                              ? "bg-red-900/30 text-red-400 border-red-800"
                              : "bg-red-50 text-red-600 border-red-100"
                            : daysLeft <= 3
                            ? darkMode
                              ? "bg-amber-900/30 text-amber-400 border-amber-800"
                              : "bg-amber-50 text-amber-700 border-amber-100"
                            : darkMode
                            ? "bg-slate-700 text-slate-400 border-slate-600"
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
                      <span className={`text-sm ${darkMode ? "text-slate-600" : "text-gray-300"}`}>—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${getStatusColor(assignment.status)}`}>
                      {assignment.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${getStatusColor(assignment.submissionStatus)}`}>
                      {assignment.submissionStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <button className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 duration-150 ${
                      darkMode
                        ? "text-slate-600 hover:text-blue-400 hover:bg-blue-900/20"
                        : "text-gray-300 hover:text-blue-600 hover:bg-blue-50"
                    }`}>
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
