import { ASSIGNMENT_STATUS, SUBMISSION_STATUS } from "../../constants/assignmentConstants";
import ProgressCard from "./ProgressCard";
import SectionHeader from "../common/SectionHeader";
import { BarChart3 } from "lucide-react";
const CompletionStatistics = ({ assignments = [] }) => {
  const total = assignments.length;
  const completed = assignments.filter(
    (a) => a.status === ASSIGNMENT_STATUS.COMPLETED
  ).length;
  const pending = assignments.filter(
    (a) => a.status === ASSIGNMENT_STATUS.PENDING
  ).length;
  const submitted = assignments.filter(
    (a) => a.submissionStatus === SUBMISSION_STATUS.SUBMITTED
  ).length;

  const stats = [
    { label: "Total Assignments", value: total, total, color: "bg-blue-500" },
    { label: "Completed", value: completed, total, color: "bg-green-500" },
    { label: "Pending", value: pending, total, color: "bg-yellow-400" },
    { label: "Submitted", value: submitted, total, color: "bg-blue-400" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
      <SectionHeader 
      title={
      <div className="flex items-center gap-2">
      <BarChart3 className="w-5 h-5 text-indigo-500" />
      <span>Completion Statistics</span>
      </div>
    } 
    />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <ProgressCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            total={stat.total}
            color={stat.color}
          />
        ))}
      </div>
    </div>
  );
};

export default CompletionStatistics;
