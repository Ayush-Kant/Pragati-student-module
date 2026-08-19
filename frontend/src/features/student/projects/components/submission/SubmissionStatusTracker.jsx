import { SUBMISSION_STATE } from '../../constants/projectConstants';
import { getSubmissionStateLabel, getSubmissionStateColor } from '../../utils/submissionHelpers';

const STEPS = [
  SUBMISSION_STATE.DRAFT,
  SUBMISSION_STATE.READY,
  SUBMISSION_STATE.SUBMITTED,
  SUBMISSION_STATE.UNDER_REVIEW,
  SUBMISSION_STATE.EVALUATED,
];

/**
 * Horizontal stepper showing the submission workflow progress.
 * @param {{ currentState: string }} props
 */
const SubmissionStatusTracker = ({ currentState }) => {
  const currentIndex = STEPS.indexOf(currentState);

  return (
    <div className="overflow-x-auto pb-2" aria-label="Submission workflow progress">
      <div className="flex items-center min-w-max gap-0">
        {STEPS.map((step, idx) => {
          const isCompleted = currentIndex > idx;
          const isCurrent = currentIndex === idx;

          return (
            <div key={step} className="flex items-center">
              {/* Node */}
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isCompleted
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                      : isCurrent
                      ? 'border-violet-500 bg-violet-500/20 text-violet-400 ring-2 ring-violet-500/30'
                      : 'border-gray-700 bg-gray-800/50 text-gray-600'
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <span
                  className={`text-xs whitespace-nowrap ${
                    isCurrent
                      ? getSubmissionStateColor(step)
                      : isCompleted
                      ? 'text-emerald-400'
                      : 'text-gray-600'
                  }`}
                >
                  {getSubmissionStateLabel(step)}
                </span>
              </div>

              {/* Connector */}
              {idx < STEPS.length - 1 && (
                <div
                  className={`h-0.5 w-10 mx-1 transition-colors duration-300 ${
                    currentIndex > idx ? 'bg-emerald-500/50' : 'bg-gray-800'
                  }`}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubmissionStatusTracker;
