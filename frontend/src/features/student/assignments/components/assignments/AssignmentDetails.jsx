import { formatDate, calculateDaysLeft, getStatusColor } from "../../utils/assignmentHelpers";

const DetailRow = ({ label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-28 shrink-0 pt-0.5">
      {label}
    </span>
    <span className="text-sm text-gray-700">{value}</span>
  </div>
);

const AssignmentDetails = ({ assignment }) => {
  if (!assignment) return null;

  const daysLeft = calculateDaysLeft(assignment.dueDate);
  const isOverdue = daysLeft !== null && daysLeft < 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3 mb-5">
        <h2 className="text-base font-bold text-gray-800">{assignment.title}</h2>
        <span
          className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(
            assignment.status
          )}`}
        >
          {assignment.status}
        </span>
      </div>

      <div className="divide-y divide-gray-100">
        <DetailRow label="Subject" value={assignment.subject} />
        <DetailRow label="Due Date" value={formatDate(assignment.dueDate)} />
        <DetailRow
          label="Days Left"
          value={
            daysLeft !== null ? (
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
                  ? `${Math.abs(daysLeft)} days overdue`
                  : daysLeft === 0
                  ? "Due today"
                  : `${daysLeft} days remaining`}
              </span>
            ) : (
              "N/A"
            )
          }
        />
        <DetailRow label="Max Marks" value={`${assignment.marks} marks`} />
        <DetailRow
          label="Submission"
          value={
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(
                assignment.submissionStatus
              )}`}
            >
              {assignment.submissionStatus}
            </span>
          }
        />
        {assignment.description && (
          <DetailRow label="Description" value={assignment.description} />
        )}
      </div>
    </div>
  );
};

export default AssignmentDetails;
