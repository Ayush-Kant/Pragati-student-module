import {
  CalendarDays,
  ChevronRight,
  BookOpen,
  Award,
} from "lucide-react";

import {
  formatDate,
  calculateDaysLeft,
  getStatusColor,
} from "../../utils/assignmentHelpers";

/* Status-to-gradient accent strip — GitHub Projects / Linear pattern */
const statusAccent = {
  Pending:   "from-amber-400 to-orange-400",
  Completed: "from-emerald-400 to-teal-500",
  Late:      "from-red-400 to-rose-500",
};

const AssignmentCard = ({ assignment, onClick }) => {
  const daysLeft = calculateDaysLeft(assignment.dueDate);
  const isOverdue = daysLeft !== null && daysLeft < 0;
  const isDueSoon = daysLeft !== null && daysLeft >= 0 && daysLeft <= 3;

  const urgencyBadge = isOverdue
    ? "bg-red-50 text-red-600 border border-red-100"
    : isDueSoon
    ? "bg-amber-50 text-amber-700 border border-amber-100"
    : "bg-gray-50 text-gray-500 border border-gray-100";

  const urgencyLabel = isOverdue
    ? `${Math.abs(daysLeft)}d overdue`
    : daysLeft === 0
    ? "Due today"
    : `${daysLeft}d left`;

  const accentGradient =
    statusAccent[assignment.status] || "from-gray-200 to-gray-300";

  return (
    <div
      onClick={() => onClick?.(assignment)}
      className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Status gradient strip — 4px, GitHub Projects / Linear pattern */}
      <div className={`h-1 bg-gradient-to-r ${accentGradient} w-full flex-none`} />

      <div className="p-5 flex flex-col gap-3.5 flex-1">

        {/* Title row + status badge */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[13px] font-semibold text-gray-900 leading-snug line-clamp-2 flex-1 tracking-tight">
            {assignment.title}
          </h3>
          <span
            className={`shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-lg ${getStatusColor(
              assignment.status
            )}`}
          >
            {assignment.status}
          </span>
        </div>

        {/* Subject */}
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="text-xs font-medium text-gray-500 truncate">
            {assignment.subject}
          </span>
        </div>

        {/* Due date + urgency */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>{formatDate(assignment.dueDate)}</span>
          </div>
          {daysLeft !== null && (
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${urgencyBadge}`}>
              {urgencyLabel}
            </span>
          )}
        </div>

        {/* Footer: marks + submission status + action */}
        <div className="mt-auto pt-3.5 border-t border-gray-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-wrap">
            {/* Marks */}
            <div className="flex items-center gap-1 shrink-0">
              <Award className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-bold text-gray-700">
                {assignment.marks}
              </span>
              <span className="text-[11px] text-gray-400 font-medium">pts</span>
            </div>

            {/* Submission status */}
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${getStatusColor(
                assignment.submissionStatus
              )}`}
            >
              {assignment.submissionStatus}
            </span>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-0.5 text-xs font-semibold text-blue-500 shrink-0 group-hover:text-blue-600 transition-colors">
            Open
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;
