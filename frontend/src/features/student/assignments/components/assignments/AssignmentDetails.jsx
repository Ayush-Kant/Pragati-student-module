import {
  formatDate,
  calculateDaysLeft,
  getStatusColor,
} from "../../utils/assignmentHelpers";
import {
  BookOpen,
  CalendarDays,
  Clock3,
  Award,
  FileText,
} from "lucide-react";

const MetaItem = ({ icon: Icon, label, children, darkMode = false }) => (
  <div className="flex flex-col gap-2">
    <div className={`flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest ${darkMode ? "text-slate-500" : "text-gray-400"}`}>
      <Icon className="w-4 h-4 text-blue-500" />
      {label}
    </div>

    <div className={`text-sm font-semibold ${darkMode ? "text-slate-200" : "text-gray-800"}`}>
      {children}
    </div>
  </div>
);

const AssignmentDetails = ({ assignment, darkMode = false }) => {
  if (!assignment) return null;

  const daysLeft = calculateDaysLeft(assignment.dueDate);
  const isOverdue = daysLeft !== null && daysLeft < 0;

  const urgencyLabel = isOverdue
    ? `${Math.abs(daysLeft)} days overdue`
    : daysLeft === 0
    ? "Due today"
    : daysLeft !== null
    ? `${daysLeft} days remaining`
    : "N/A";

  const urgencyColor = isOverdue
    ? darkMode
      ? "bg-red-900/30 text-red-400 border border-red-800"
      : "bg-red-50 text-red-600 border border-red-200"
    : daysLeft !== null && daysLeft <= 3
    ? darkMode
      ? "bg-amber-900/30 text-amber-400 border border-amber-800"
      : "bg-amber-50 text-amber-700 border border-amber-200"
    : darkMode
    ? "bg-blue-900/30 text-blue-400 border border-blue-800"
    : "bg-blue-50 text-blue-700 border border-blue-200";

  return (
    <div className={`overflow-hidden rounded-2xl border shadow-sm transition-colors ${darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-100"}`}>

      {/* ================= HERO ================= */}

      <div className={`border-t-4 border-blue-600 px-8 py-8 ${darkMode ? "bg-slate-900" : "bg-white"}`}>

        <div className="flex items-start justify-between gap-6">

          {/* Left */}

          <div className="flex items-start gap-5 flex-1">

            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-lg ${
              darkMode
                ? "bg-gradient-to-br from-blue-500 to-blue-700 shadow-blue-300/40"
                : "bg-blue-50 shadow-blue-100/60"
            }`}>
              <BookOpen className={`h-8 w-8 ${darkMode ? "text-white" : "text-blue-600"}`} />
            </div>

            <div className="flex-1">

              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${darkMode ? "bg-blue-900/40 text-blue-400" : "bg-blue-50 text-blue-700"}`}>
                {assignment.subject}
              </span>

              <h1 className={`mt-4 text-3xl font-bold tracking-tight ${darkMode ? "text-white" : "text-gray-900"}`}>
                {assignment.title}
              </h1>

              {assignment.description && (
                <p className={`mt-4 max-w-3xl text-sm leading-7 ${darkMode ? "text-slate-400" : "text-gray-600"}`}>
                  {assignment.description}
                </p>
              )}
            </div>

          </div>

          {/* Status */}

          <span className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold shadow-sm ${getStatusColor(assignment.status)}`}>
            {assignment.status}
          </span>

        </div>

      </div>

      {/* ================= METADATA ================= */}

      <div className={`grid grid-cols-2 gap-5 border-t p-8 sm:grid-cols-4 transition-colors ${darkMode ? "border-slate-700 bg-slate-800/50" : "border-gray-100 bg-gray-50"}`}>

        <div className={`rounded-2xl border p-5 shadow-sm transition-colors ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"}`}>
          <MetaItem icon={CalendarDays} label="Due Date" darkMode={darkMode}>
            {formatDate(assignment.dueDate)}
          </MetaItem>
        </div>

        <div className={`rounded-2xl border p-5 shadow-sm transition-colors ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"}`}>
          <MetaItem icon={Clock3} label="Deadline" darkMode={darkMode}>
            <span className={`inline-flex rounded-lg px-3 py-1 text-xs font-semibold ${urgencyColor}`}>
              {urgencyLabel}
            </span>
          </MetaItem>
        </div>

        <div className={`rounded-2xl border p-5 shadow-sm transition-colors ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"}`}>
          <MetaItem icon={Award} label="Maximum Marks" darkMode={darkMode}>
            <span className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              {assignment.marks}
            </span>
          </MetaItem>
        </div>

        <div className={`rounded-2xl border p-5 shadow-sm transition-colors ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"}`}>
          <MetaItem icon={FileText} label="Submission" darkMode={darkMode}>
            <span className={`inline-flex rounded-lg px-3 py-1 text-xs font-semibold ${getStatusColor(assignment.submissionStatus)}`}>
              {assignment.submissionStatus}
            </span>
          </MetaItem>
        </div>

      </div>

    </div>
  );
};

export default AssignmentDetails;