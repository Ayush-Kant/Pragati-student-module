import { memo } from 'react';
import SubmissionCard from './SubmissionCard';
import EmptyState from '../common/EmptyState';

/**
 * List of submission cards.
 *
 * @param {{ submissions: object[] }} props
 */
const SubmissionHistory = memo(({ submissions }) => {
  if (!submissions?.length) {
    return (
      <EmptyState
        title="No submissions yet"
        description="Submit your solution to see your history here."
        icon="📋"
      />
    );
  }

  return (
    <div className="space-y-2" role="list" aria-label="Submission history">
      {submissions.map((submission) => (
        <div key={submission.id} role="listitem">
          <SubmissionCard submission={submission} />
        </div>
      ))}
    </div>
  );
});

SubmissionHistory.displayName = 'SubmissionHistory';

export default SubmissionHistory;
