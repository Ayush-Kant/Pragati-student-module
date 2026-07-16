import { formatDate, calculateDaysLeft } from "../../utils/assignmentHelpers";
import { ASSIGNMENT_STATUS } from "../../constants/assignmentConstants";
import EmptyState from "../common/EmptyState";
import SectionHeader from "../common/SectionHeader";
import { CheckCircle2, AlarmClock, CalendarDays } from "lucide-react";

const DeadlineTracker = ({ assignments = [] }) => {
  const pending = assignments
    .filter((a) => a.status === ASSIGNMENT_STATUS.PENDING)
    .map((a) => ({ ...a, daysLeft: calculateDaysLeft(a.dueDate) }))
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const overdueCount = pending.filter((a) => a.daysLeft < 0).length;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Card header with subtle gradient — Vercel sidebar panel style */}
      <div className="bg-gradient-to-b from-gray-50/80 to-white px-5 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlarmClock className="w-4 h-4 text-rose-500" />
            <h2 className="text-sm font-semibold text-gray-800 tracking-tight">
              Deadline Tracker
            </h2>
          </div>
          <div className="flex items-center gap-1.5">
            {overdueCount > 0 && (
              <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-md">
                {overdueCount} overdue
              </span>
            )}
            <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
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
          />
        ) : (
          <div className="flex flex-col gap-2">
            {pending.map((assignment) => {
              const isOverdue = assignment.daysLeft < 0;
              const isDueSoon = !isOverdue && assignment.daysLeft <= 3;

              /* Left border + bg by urgency level */
              const rowStyle = isOverdue
                ? "border-l-red-400 bg-red-50/30"
                : isDueSoon
                ? "border-l-amber-400 bg-amber-50/30"
                : "border-l-blue-300 bg-gray-50/60";

              /* Day count display */
              const dayText = isOverdue
                ? `${Math.abs(assignment.daysLeft)}`
                : assignment.daysLeft === 0
                ? "0"
                : `${assignment.daysLeft}`;

              const dayLabel = isOverdue ? "overdue" : assignment.daysLeft === 0 ? "today" : "left";

              const dayColor = isOverdue
                ? "text-red-600"
                : isDueSoon
                ? "text-amber-600"
                : "text-blue-600";

              return (
                <div
                  key={assignment.id}
                  className={`flex items-center gap-3 pl-3 pr-3.5 py-3 rounded-xl border border-gray-100 border-l-[3px] ${rowStyle} hover:shadow-sm transition-all duration-200`}
                >
                  {/* Prominent day count — Linear dashboard style */}
                  <div className="shrink-0 flex flex-col items-center w-9 text-center">
                    <span className={`text-base font-bold leading-none ${dayColor}`}>
                      {dayText}d
                    </span>
                    <span className={`text-[10px] font-medium leading-tight mt-0.5 ${dayColor} opacity-70`}>
                      {dayLabel}
                    </span>
                  </div>

                  {/* Separator */}
                  <div className="w-px h-8 bg-gray-200 shrink-0" />

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-gray-800 truncate leading-tight">
                      {assignment.title}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <CalendarDays className="w-2.5 h-2.5 text-gray-400 shrink-0" />
                      <span className="text-[10px] text-gray-400 font-medium truncate">
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
