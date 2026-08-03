import SubmissionRow from "./SubmissionRow";
import { submissions } from "../../services/submissionService";

export default function SubmissionTable() {
  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-sm min-h-[430px]">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
            <th className="px-4 py-4">Student / Team</th>
            <th className="px-4 py-4">Project</th>
            <th className="px-4 py-4">Progress</th>
            <th className="px-4 py-4">Status</th>
            <th className="px-4 py-4">Late Penalty</th>
            <th className="px-4 py-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {submissions.map((item) => (
            <SubmissionRow
              key={item.student}
              {...item}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}