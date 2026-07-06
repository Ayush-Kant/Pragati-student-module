import { formatDate, calculateDaysLeft, getStatusColor } from "../../utils/assignmentHelpers";

const AssignmentCard = ({ assignment, onClick }) => {
  const daysLeft = calculateDaysLeft(assignment.dueDate);
  const isOverdue = daysLeft !== null && daysLeft < 0;
  const isDueSoon = daysLeft !== null && daysLeft >= 0 && daysLeft <= 3;

  return (
    <div
      onClick={() => onClick?.(assignment)}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-sm font-semibold text-gray-800 leading-snug">
          {assignment.title}
        </h3>
        <span
          className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(
            assignment.status
          )}`}
        >
          {assignment.status}
        </span>
      </div>

      <p className="text-xs text-gray-400 mb-3">{assignment.subject}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span>📅</span>
          <span>Due {formatDate(assignment.dueDate)}</span>
        </div>

        {daysLeft !== null && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              isOverdue
                ? "bg-red-100 text-red-600"
                : isDueSoon
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {isOverdue
              ? `${Math.abs(daysLeft)}d overdue`
              : daysLeft === 0
              ? "Due today"
              : `${daysLeft}d left`}
          </span>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          Marks: <span className="font-semibold text-gray-600">{assignment.marks}</span>
        </span>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusColor(
            assignment.submissionStatus
          )}`}
        >
          {assignment.submissionStatus}
        </span>
      </div>
    </div>
  );
};

export default AssignmentCard;
