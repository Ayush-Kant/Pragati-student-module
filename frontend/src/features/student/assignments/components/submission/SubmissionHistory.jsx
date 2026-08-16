import { formatDate, getStatusColor } from "../../utils/assignmentHelpers";
import EmptyState from "../common/EmptyState";
import SectionHeader from "../common/SectionHeader";
import { History, FileText, CheckCircle2, Clock3, AlertTriangle } from "lucide-react";

const statusDotColor = (status) => {
  if (status === "Submitted") return "bg-emerald-400";
  if (status === "Late") return "bg-red-400";
  return "bg-blue-400";
};

const statusIcon = (status) => {
  if (status === "Submitted") return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
  if (status === "Late") return <AlertTriangle className="w-3.5 h-3.5 text-red-500" />;
  return <Clock3 className="w-3.5 h-3.5 text-blue-500" />;
};

const SubmissionHistory = ({ history = [], darkMode = false }) => (
  <div className={`rounded-2xl border shadow-sm p-5 sm:p-6 transition-colors ${darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-100"}`}>
    <SectionHeader
      title={
        <div className="flex items-center gap-2">
          <History className={`w-5 h-5 ${darkMode ? "text-slate-400" : "text-gray-500"}`} />
          <span>Submission History</span>
        </div>
      }
      subtitle={`${history.length} attempt${history.length !== 1 ? "s" : ""}`}
      darkMode={darkMode}
    />

    {history.length === 0 ? (
      <EmptyState
        icon={<History className={`w-8 h-8 ${darkMode ? "text-slate-600" : "text-gray-400"}`} />}
        title="No submissions yet"
        description="Your submission attempts will appear here."
        darkMode={darkMode}
      />
    ) : (
      <div className="flex flex-col gap-0">
        {history.map((entry, index) => (
          <div key={entry.id ?? index} className="flex items-start gap-3 pb-4 last:pb-0">
            {/* Timeline connector */}
            <div className="flex flex-col items-center shrink-0 pt-1">
              <div className={`w-2.5 h-2.5 rounded-full mt-0.5 ${statusDotColor(entry.status)}`} />
              {index < history.length - 1 && (
                <div className={`w-px flex-1 mt-1.5 min-h-[24px] ${darkMode ? "bg-slate-700" : "bg-gray-100"}`} />
              )}
            </div>

            {/* Content */}
            <div className={`flex-1 min-w-0 rounded-xl px-4 py-3 border transition-colors ${darkMode ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-100"}`}>
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className={`text-sm font-semibold ${darkMode ? "text-slate-200" : "text-gray-800"}`}>
                  Attempt #{index + 1}
                </p>
                <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusColor(entry.status)}`}>
                  {statusIcon(entry.status)}
                  {entry.status}
                </span>
              </div>
              {entry.submittedAt && (
                <p className={`text-xs ${darkMode ? "text-slate-500" : "text-gray-400"}`}>{formatDate(entry.submittedAt)}</p>
              )}
              {entry.fileName && (
                <p className={`text-xs mt-1.5 flex items-center gap-1.5 font-medium ${darkMode ? "text-slate-400" : "text-gray-600"}`}>
                  <FileText className={`w-3.5 h-3.5 ${darkMode ? "text-slate-600" : "text-gray-400"}`} />
                  {entry.fileName}
                </p>
              )}
              {entry.notes && (
                <p className={`text-xs mt-1 italic leading-relaxed ${darkMode ? "text-slate-500" : "text-gray-500"}`}>
                  "{entry.notes}"
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default SubmissionHistory;
