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

const AssignmentCard = ({ assignment, onClick, darkMode = false }) => {
  const daysLeft = calculateDaysLeft(assignment.dueDate);
  const isOverdue = daysLeft !== null && daysLeft < 0;
  const isDueSoon = daysLeft !== null && daysLeft >= 0 && daysLeft <= 3;

  const urgencyBadge = isOverdue
    ? darkMode
      ? "bg-red-900/30 text-red-400 border border-red-800"
      : "bg-red-50 text-red-600 border border-red-100"
    : isDueSoon
    ? darkMode
      ? "bg-amber-900/30 text-amber-400 border border-amber-800"
      : "bg-amber-50 text-amber-700 border border-amber-100"
    : darkMode
    ? "bg-slate-700 text-slate-400 border border-slate-600"
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
      className={`group relative rounded-2xl border shadow-sm overflow-hidden cursor-pointer flex flex-col transition-all duration-300 ${
        darkMode
          ? "bg-slate-900 border-slate-700 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-1"
          : "bg-white border-gray-100 hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-1"
      }`}
    >
      {/* Status gradient strip */}
      <div className={`h-1 bg-gradient-to-r ${accentGradient} w-full flex-none`} />

      <div className="p-5 flex flex-col gap-3.5 flex-1">

        {/* Title row + status badge */}
        <div className="flex items-start justify-between gap-3">
          <h3 className={`text-[13px] font-semibold leading-snug line-clamp-2 flex-1 tracking-tight ${darkMode ? "text-slate-100" : "text-gray-900"}`}>
            {assignment.title}
          </h3>
          <span className={`shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-lg ${getStatusColor(assignment.status)}`}>
            {assignment.status}
          </span>
        </div>

        {/* Subject */}
        <div className="flex items-center gap-1.5">
          <BookOpen className={`w-3.5 h-3.5 shrink-0 ${darkMode ? "text-slate-500" : "text-gray-400"}`} />
          <span className={`text-xs font-medium truncate ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
            {assignment.subject}
          </span>
        </div>

        {/* Due date + urgency */}
        <div className="flex items-center justify-between gap-2">
          <div className={`flex items-center gap-1.5 text-xs ${darkMode ? "text-slate-500" : "text-gray-400"}`}>
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
        <div className={`mt-auto pt-3.5 border-t flex items-center justify-between gap-2 ${darkMode ? "border-slate-700" : "border-gray-100"}`}>
          <div className="flex items-center gap-2.5 min-w-0 flex-wrap">
            {/* Marks */}
            <div className="flex items-center gap-1 shrink-0">
              <Award className={`w-3.5 h-3.5 ${darkMode ? "text-slate-500" : "text-gray-400"}`} />
              <span className={`text-xs font-bold ${darkMode ? "text-slate-300" : "text-gray-700"}`}>
                {assignment.marks}
              </span>
              <span className={`text-[11px] font-medium ${darkMode ? "text-slate-500" : "text-gray-400"}`}>pts</span>
            </div>

            {/* Submission status */}
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${getStatusColor(assignment.submissionStatus)}`}>
              {assignment.submissionStatus}
            </span>
          </div>

          {/* CTA */}
          <div className={`flex items-center gap-0.5 text-xs font-semibold shrink-0 transition-colors ${darkMode ? "text-blue-400 group-hover:text-blue-300" : "text-blue-500 group-hover:text-blue-600"}`}>
            Open
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;
