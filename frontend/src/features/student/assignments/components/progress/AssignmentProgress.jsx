import CompletionStatistics from "./CompletionStatistics";
import DeadlineTracker from "./DeadlineTracker";

const AssignmentProgress = ({ assignments = [] }) => (
  <div className="flex flex-col gap-5">
    <CompletionStatistics assignments={assignments} />
    <DeadlineTracker assignments={assignments} />
  </div>
);

export default AssignmentProgress;
