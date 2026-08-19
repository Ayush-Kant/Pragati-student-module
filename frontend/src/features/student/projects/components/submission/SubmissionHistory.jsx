import { Clock, RotateCcw, MessageSquare } from 'lucide-react';
import { formatDate } from '../../utils/projectHelpers';
import { getSubmissionStateLabel, getSubmissionStateColor } from '../../utils/submissionHelpers';

/**
 * Submission history list.
 * @param {{ history: object[] }} props
 */
const SubmissionHistory = ({ history }) => {
  if (!history?.length) {
    return (
      <div className="text-center py-8">
        <Clock size={32} className="mx-auto text-gray-700 mb-3" aria-hidden="true" />
        <p className="text-sm text-gray-500">No submissions yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-200 mb-4">Submission History</h4>
      {history.map((entry) => (
        <div
          key={entry.id}
          className="bg-white/2 border border-white/6 rounded-xl p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-300">
                Version {entry.version}
              </span>
              <span className={`text-xs font-medium ${getSubmissionStateColor(entry.status)}`}>
                · {getSubmissionStateLabel(entry.status)}
              </span>
            </div>
            <span className="text-xs text-gray-600">{formatDate(entry.submittedAt)}</span>
          </div>

          {entry.feedback && (
            <div className="flex items-start gap-2 mt-2 bg-violet-500/5 border border-violet-500/15 rounded-lg p-3">
              <MessageSquare size={14} className="text-violet-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-xs text-gray-300 leading-relaxed">{entry.feedback}</p>
            </div>
          )}

          {entry.canResubmit && (
            <button
              type="button"
              className="mt-3 flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              <RotateCcw size={12} aria-hidden="true" />
              Resubmit available
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default SubmissionHistory;
