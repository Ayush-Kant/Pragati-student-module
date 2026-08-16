import {
  ASSIGNMENT_STATUS,
  SUBMISSION_STATUS,
} from "../../constants/assignmentConstants";
import ProgressCard from "./ProgressCard";
import {
  BarChart3,
  ClipboardList,
  CircleCheckBig,
  Clock3,
  Upload,
} from "lucide-react";

const CompletionStatistics = ({ assignments = [], darkMode = false }) => {
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
    {
      label: "Total Assignments",
      value: total,
      total,
      color: "bg-blue-500",
      iconBg: "bg-blue-50",
      textColor: "text-blue-600",
      icon: <ClipboardList className="w-4 h-4 text-blue-500" />,
    },
    {
      label: "Completed",
      value: completed,
      total,
      color: "bg-emerald-500",
      iconBg: "bg-emerald-50",
      textColor: "text-emerald-600",
      icon: <CircleCheckBig className="w-4 h-4 text-emerald-500" />,
    },
    {
      label: "Pending",
      value: pending,
      total,
      color: "bg-amber-400",
      iconBg: "bg-amber-50",
      textColor: "text-amber-600",
      icon: <Clock3 className="w-4 h-4 text-amber-500" />,
    },
    {
      label: "Submitted",
      value: submitted,
      total,
      color: "bg-indigo-500",
      iconBg: "bg-indigo-50",
      textColor: "text-indigo-600",
      icon: <Upload className="w-4 h-4 text-indigo-500" />,
    },
  ];

  return (
    <div>
      {/* Section label */}
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className={`w-3.5 h-3.5 ${darkMode ? "text-slate-600" : "text-gray-400"}`} />
        <p className={`text-[11px] font-semibold uppercase tracking-widest ${darkMode ? "text-slate-500" : "text-gray-400"}`}>
          Overview
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <ProgressCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            total={stat.total}
            color={stat.color}
            iconBg={stat.iconBg}
            textColor={stat.textColor}
            icon={stat.icon}
            darkMode={darkMode}
          />
        ))}
      </div>
    </div>
  );
};

export default CompletionStatistics;
