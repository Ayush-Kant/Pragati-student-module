import { getStatusColor } from "../../utils/assignmentHelpers";

const STATUS_ICONS = {
  Submitted: "✅",
  "Not Submitted": "⏳",
  Late: "⚠️",
};

const SubmissionStatus = ({ status }) => {
  if (!status) return null;

  const icon = STATUS_ICONS[status] ?? "📌";

  return (
    <div className="flex items-center gap-2">
      <span>{icon}</span>
      <span
        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(status)}`}
      >
        {status}
      </span>
    </div>
  );
};

export default SubmissionStatus;
