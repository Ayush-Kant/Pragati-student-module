import { ASSIGNMENT_STATUS } from "../../constants/assignmentConstants";
import { formatDate, getStatusColor } from "../../utils/assignmentHelpers";
import EmptyState from "../common/EmptyState";
import SectionHeader from "../common/SectionHeader";
import { CheckCircle2, ChevronRight, CalendarDays } from "lucide-react";

const CompletedAssignments = ({ assignments = [], onSelect, darkMode = false }) => {
  const completed = assignments.filter(
    (a) => a.status === ASSIGNMENT_STATUS.COMPLETED
  );

  return (
    <div className={`rounded-2xl border shadow-sm p-5 sm:p-6 transition-colors ${darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-100"}`}>
      <SectionHeader
        title={
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>Completed Assignments</span>
          </div>
        }
        subtitle={`${completed.length} completed`}
        darkMode={darkMode}
      />

      {completed.length === 0 ? (
        <EmptyState
          icon={<CheckCircle2 className={`w-8 h-8 ${darkMode ? "text-slate-600" : "text-gray-400"}`} />}
          title="No completed assignments"
          description="Completed assignments will appear here."
          darkMode={darkMode}
        />
      ) : (
        <div className="flex flex-col gap-2">
          {completed.map((assignment) => (
            <div
              key={assignment.id}
              onClick={() => onSelect?.(assignment)}
              className={`flex items-center justify-between px-4 py-3.5 rounded-xl border cursor-pointer group transition-all duration-200 ${
                darkMode
                  ? "border-slate-700 bg-slate-800/60 hover:bg-slate-700 hover:shadow-sm hover:-translate-y-0.5"
                  : "border-gray-100 bg-gray-50/60 hover:bg-white hover:shadow-sm hover:-translate-y-0.5"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${darkMode ? "bg-emerald-900/30" : "bg-emerald-50"}`}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate transition-colors ${darkMode ? "text-slate-200 group-hover:text-blue-400" : "text-gray-800 group-hover:text-blue-700"}`}>
                    {assignment.title}
                  </p>
                  <p className={`text-xs mt-0.5 flex items-center gap-1 ${darkMode ? "text-slate-500" : "text-gray-400"}`}>
                    <CalendarDays className="w-3 h-3" />
                    {formatDate(assignment.dueDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0 ml-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(assignment.submissionStatus)}`}>
                  {assignment.submissionStatus}
                </span>
                <ChevronRight className={`w-4 h-4 transition-colors ${darkMode ? "text-slate-600 group-hover:text-blue-400" : "text-gray-300 group-hover:text-blue-500"}`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedAssignments;
