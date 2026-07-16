import { getStatusColor } from "../../utils/assignmentHelpers";
import { CheckCircle2, Clock3, AlertTriangle, FileText } from "lucide-react";

const STATUS_ICONS = {
  Submitted: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  "Not Submitted": <Clock3 className="w-4 h-4 text-amber-500" />,
  Late: <AlertTriangle className="w-4 h-4 text-red-500" />,
};

const SubmissionStatus = ({ status }) => {
  if (!status) return null;

  const icon = STATUS_ICONS[status] ?? <FileText className="w-4 h-4 text-gray-400" />;

  return (
    <div className="flex items-center gap-2">
      {icon}
      <span
        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(status)}`}
      >
        {status}
      </span>
    </div>
  );
};

export default SubmissionStatus;
