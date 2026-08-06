import React from "react";
import { CheckCircle2, Clock, ListTodo, Award } from "lucide-react";

export const ProjectOverview = ({ project, milestones = [] }) => {
  const totalTasks = milestones.reduce((acc, m) => acc + (m.tasks?.length || 0), 0);
  const completedTasks = milestones.reduce(
    (acc, m) => acc + (m.tasks?.filter((t) => t.status === "COMPLETED").length || 0),
    0
  );
  const completedMilestones = milestones.filter((m) => m.status === "COMPLETED").length;

  const stats = [
    {
      label: "Overall Completion",
      value: `${project?.progressPercent || 0}%`,
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50",
    },
    {
      label: "Milestones Reached",
      value: `${completedMilestones} / ${milestones.length}`,
      icon: Award,
      color: "text-brand-600 bg-brand-50 dark:bg-brand-950/50",
    },
    {
      label: "Tasks Completed",
      value: `${completedTasks} / ${totalTasks}`,
      icon: ListTodo,
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50",
    },
    {
      label: "Status",
      value: project?.status?.replace("_", " ") || "In Progress",
      icon: Clock,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-5 shadow-sm flex items-center space-x-4"
          >
            <div className={`p-3 rounded-xl ${stat.color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-surface-500 dark:text-surface-400">{stat.label}</p>
              <p className="text-lg font-extrabold text-surface-900 dark:text-white capitalize">{stat.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectOverview;
