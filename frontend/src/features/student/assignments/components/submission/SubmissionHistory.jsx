import { formatDate, getStatusColor } from "../../utils/assignmentHelpers";
import EmptyState from "../common/EmptyState";
import SectionHeader from "../common/SectionHeader";

const SubmissionHistory = ({ history = [] }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
    <SectionHeader
      title="Submission History"
      subtitle={`${history.length} attempt${history.length !== 1 ? "s" : ""}`}
    />

    {history.length === 0 ? (
      <EmptyState
        icon="🕐"
        title="No submissions yet"
        description="Your submission attempts will appear here."
      />
    ) : (
      <div className="flex flex-col gap-0">
        {history.map((entry, index) => (
          <div key={entry.id ?? index} className="flex items-start gap-3 pb-4 last:pb-0">
            {/* Timeline line */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400 mt-1.5" />
              {index < history.length - 1 && (
                <div className="w-px flex-1 bg-gray-100 mt-1 min-h-[24px]" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pb-4 last:pb-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <p className="text-sm font-semibold text-gray-800">
                  Attempt #{index + 1}
                </p>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusColor(
                    entry.status
                  )}`}
                >
                  {entry.status}
                </span>
              </div>
              {entry.submittedAt && (
                <p className="text-xs text-gray-400">
                  {formatDate(entry.submittedAt)}
                </p>
              )}
              {entry.fileName && (
                <p className="text-xs text-gray-500 mt-1 truncate">
                  📄 {entry.fileName}
                </p>
              )}
              {entry.notes && (
                <p className="text-xs text-gray-500 mt-1 italic">{entry.notes}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default SubmissionHistory;
