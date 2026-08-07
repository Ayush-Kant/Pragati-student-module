import { memo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import VerdictBadge from './VerdictBadge';
import ExecutionSummary from './ExecutionSummary';
import LanguageBadge from '../challenge/LanguageBadge';
import { formatSubmissionDate } from '../../utils/codingChallengeHelpers';

/**
 * Expandable card for a single submission entry.
 *
 * @param {{ submission: object }} props
 */
const SubmissionCard = memo(({ submission }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors duration-200">
      {/* Summary row */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-900/30 transition-colors"
        aria-expanded={isExpanded}
      >
        <VerdictBadge verdict={submission.verdict} size="sm" />
        <LanguageBadge language={submission.language} />
        <span className="flex-1">
          <ExecutionSummary submission={submission} />
        </span>
        <span className="text-xs text-gray-600 ml-auto flex-shrink-0">
          {formatSubmissionDate(submission.submittedAt)}
        </span>
        {isExpanded ? (
          <ChevronUp size={14} className="text-gray-500 flex-shrink-0" aria-hidden="true" />
        ) : (
          <ChevronDown size={14} className="text-gray-500 flex-shrink-0" aria-hidden="true" />
        )}
      </button>

      {/* Expanded: code view */}
      {isExpanded && (
        <div className="border-t border-gray-800">
          <pre className="p-4 text-xs font-mono text-gray-300 bg-[#080808] overflow-x-auto scrollbar-thin max-h-64 leading-relaxed">
            {submission.code}
          </pre>
        </div>
      )}
    </div>
  );
});

SubmissionCard.displayName = 'SubmissionCard';

export default SubmissionCard;
