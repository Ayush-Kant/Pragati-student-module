import { formatDate, calculateDaysLeft } from "../../utils/assignmentHelpers";
import { ASSIGNMENT_STATUS } from "../../constants/assignmentConstants";
import EmptyState from "../common/EmptyState";
import SectionHeader from "../common/SectionHeader";
import { CheckCircle2, AlarmClock, CalendarDays } from "lucide-react";

const DeadlineTracker = ({ assignments = [], darkMode = false }) => {
  const pending = assignments
    .filter((a) => a.status === ASSIGNMENT_STATUS.PENDING)
    .map((a) => ({ ...a, daysLeft: calculateDaysLeft(a.dueDate) }))
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const overdueCount = pending.filter((a) => a.daysLeft < 0).length;

  return (
    <div className={`rounded-2xl border shadow-sm overflow-hidden transition-colors duration-300 ${darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-100"}`}>
      {/* Card header */}
      <div className={`px-5 pt-5 pb-4 border-b transition-colors ${darkMode ? "bg-slate-800/60 border-slate-700" : "bg-gradient-to-b from-gray-50/80 to-white border-gray-100"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlarmClock className="w-4 h-4 text-rose-500" />
            <h2 className={`text-sm font-semibold tracking-tight ${darkMode ? "text-slate-200" : "text-gray-800"}`}>
              Deadline Tracker
            </h2>
          </div>
          <div className="flex items-center gap-1.5">
            {overdueCount > 0 && (
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${darkMode ? "text-red-400 bg-red-900/30 border-red-800" : "text-red-600 bg-red-50 border-red-100"}`}>
                {overdueCount} overdue
              </span>
            )}
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${darkMode ? "text-slate-400 bg-slate-700" : "text-gray-400 bg-gray-100"}`}>
              {pending.length}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4">
        {pending.length === 0 ? (
          <EmptyState
            icon={<CheckCircle2 className="w-8 h-8 text-emerald-400" />}
            title="All caught up"
            description="No pending deadlines at this time."
            darkMode={darkMode}
          />
        ) : (
          <div className="flex flex-col gap-2">
            {pending.map((assignment) => {
              const isOverdue = assignment.daysLeft < 0;
              const isDueSoon = !isOverdue && assignment.daysLeft <= 3;

              /* Left border + bg by urgency level */
              const rowStyle = isOverdue
                ? darkMode
                  ? "border-l-red-500 bg-red-900/10"
                  : "border-l-red-400 bg-red-50/30"
                : isDueSoon
                ? darkMode
                  ? "border-l-amber-500 bg-amber-900/10"
                  : "border-l-amber-400 bg-amber-50/30"
                : darkMode
                ? "border-l-blue-500 bg-blue-900/5"
                : "border-l-blue-300 bg-gray-50/60";

              const borderColor = darkMode ? "border-slate-700" : "border-gray-100";

              /* Day count display */
              const dayText = isOverdue
                ? `${Math.abs(assignment.daysLeft)}`
                : assignment.daysLeft === 0
                ? "0"
                : `${assignment.daysLeft}`;

              const dayLabel = isOverdue ? "overdue" : assignment.daysLeft === 0 ? "today" : "left";

              const dayColor = isOverdue
                ? "text-red-500"
                : isDueSoon
                ? "text-amber-500"
                : "text-blue-500";

              return (
                <div
                  key={assignment.id}
                  className={`flex items-center gap-3 pl-3 pr-3.5 py-3 rounded-xl border border-l-[3px] hover:shadow-sm transition-all duration-200 ${rowStyle} ${borderColor}`}
                >
                  {/* Prominent day count */}
                  <div className="shrink-0 flex flex-col items-center w-9 text-center">
                    <span className={`text-base font-bold leading-none ${dayColor}`}>
                      {dayText}d
                    </span>
                    <span className={`text-[10px] font-medium leading-tight mt-0.5 ${dayColor} opacity-70`}>
                      {dayLabel}
                    </span>
                  </div>

                  {/* Separator */}
                  <div className={`w-px h-8 shrink-0 ${darkMode ? "bg-slate-600" : "bg-gray-200"}`} />

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-semibold truncate leading-tight ${darkMode ? "text-slate-200" : "text-gray-800"}`}>
                      {assignment.title}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <CalendarDays className={`w-2.5 h-2.5 shrink-0 ${darkMode ? "text-slate-600" : "text-gray-400"}`} />
                      <span className={`text-[10px] font-medium truncate ${darkMode ? "text-slate-500" : "text-gray-400"}`}>
                        {formatDate(assignment.dueDate)} · {assignment.subject}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeadlineTracker;
