import CompletionStatistics from "./CompletionStatistics";
import DeadlineTracker from "./DeadlineTracker";

const AssignmentProgress = ({ assignments = [], darkMode = false }) => (
  <div className="flex flex-col gap-5">
    <CompletionStatistics assignments={assignments} darkMode={darkMode} />
    <DeadlineTracker assignments={assignments} darkMode={darkMode} />
  </div>
);

export default AssignmentProgress;
