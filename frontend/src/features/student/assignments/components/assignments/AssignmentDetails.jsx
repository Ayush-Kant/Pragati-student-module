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

const MetaItem = ({ icon: Icon, label, children }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
      <Icon className="w-4 h-4 text-blue-500" />
      {label}
    </div>

    <div className="text-sm font-semibold text-gray-800">
      {children}
    </div>
  </div>
);

const AssignmentDetails = ({ assignment }) => {
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
    ? "bg-red-50 text-red-600 border border-red-200"
    : daysLeft !== null && daysLeft <= 3
    ? "bg-amber-50 text-amber-700 border border-amber-200"
    : "bg-blue-50 text-blue-700 border border-blue-200";

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

      {/* ================= HERO ================= */}

      <div className="border-t-4 border-blue-600 bg-white px-8 py-8">

        <div className="flex items-start justify-between gap-6">

          {/* Left */}

          <div className="flex items-start gap-5 flex-1">

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-300/40">
              <BookOpen className="h-8 w-8 text-white" />
            </div>

            <div className="flex-1">

              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                {assignment.subject}
              </span>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
                {assignment.title}
              </h1>

              {assignment.description && (
                <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-600">
                  {assignment.description}
                </p>
              )}
            </div>

          </div>

          {/* Status */}

          <span
            className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm ${getStatusColor(
              assignment.status
            )}`}
          >
            {assignment.status}
          </span>

        </div>

      </div>

      {/* ================= METADATA ================= */}

      <div className="grid grid-cols-2 gap-5 border-t border-gray-100 bg-gray-50 p-8 sm:grid-cols-4">

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <MetaItem icon={CalendarDays} label="Due Date">
            {formatDate(assignment.dueDate)}
          </MetaItem>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <MetaItem icon={Clock3} label="Deadline">
            <span
              className={`inline-flex rounded-lg px-3 py-1 text-xs font-semibold ${urgencyColor}`}
            >
              {urgencyLabel}
            </span>
          </MetaItem>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <MetaItem icon={Award} label="Maximum Marks">
            <span className="text-xl font-bold text-gray-900">
              {assignment.marks}
            </span>
          </MetaItem>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <MetaItem icon={FileText} label="Submission">
            <span
              className={`inline-flex rounded-lg px-3 py-1 text-xs font-semibold ${getStatusColor(
                assignment.submissionStatus
              )}`}
            >
              {assignment.submissionStatus}
            </span>
          </MetaItem>
        </div>

      </div>

    </div>
  );
};

export default AssignmentDetails;