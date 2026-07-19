import { MoreVertical } from "lucide-react";
import ProgressBar from "./ProgressBar";

export default function SubmissionRow({
  student,
  project,
  progress,
  status,
  penalty,
}) {
  const statusStyles = {
    Submitted: "bg-green-100 text-green-700",
    "In Progress": "bg-yellow-100 text-yellow-700",
    Late: "bg-red-100 text-red-700",
    "Not Started": "bg-gray-100 text-gray-600",
  };

  const progressColor = {
    Submitted: "bg-blue-500",
    "In Progress": "bg-blue-400",
    Late: "bg-red-500",
    "Not Started": "bg-gray-400",
  };

  return (
    <tr className="border-t">
      <td className="px-4 py-4 text-sm text-gray-700">
        {student}
      </td>

      <td className="px-4 py-4 text-sm text-gray-700">
        {project}
      </td>

      <td className="px-4 py-4">
        <ProgressBar
          value={progress}
          color={progressColor[status]}
        />
      </td>

      <td className="px-4 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status]}`}
        >
          {status}
        </span>
      </td>

      <td className="px-4 py-4 text-sm font-medium text-red-500">
        {penalty}
      </td>

      <td className="px-4 py-4 text-center">
        <button className="hover:bg-gray-100 rounded-full p-1">
          <MoreVertical size={18} />
        </button>
      </td>
    </tr>
  );
}