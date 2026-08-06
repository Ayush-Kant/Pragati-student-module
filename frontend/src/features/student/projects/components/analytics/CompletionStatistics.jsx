import React from "react";
import { CheckCircle, Clock, Zap, GitCommit } from "lucide-react";

export const CompletionStatistics = ({ overview }) => {
  if (!overview) return null;

  const cards = [
    {
      title: "Completion Rate",
      value: `${overview.completionRate}%`,
      subtitle: `${overview.completedTasks} of ${overview.totalTasks} tasks done`,
      icon: CheckCircle,
      color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
    },
    {
      title: "Sprint Velocity",
      value: overview.velocityScore,
      subtitle: "Based on milestone cadence",
      icon: Zap,
      color: "bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400",
    },
    {
      title: "Commits This Month",
      value: overview.commitsThisMonth,
      subtitle: "Across active branches",
      icon: GitCommit,
      color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
    },
    {
      title: "Logged Effort",
      value: `${overview.hoursLogged} hrs`,
      subtitle: "Team total work time",
      icon: Clock,
      color: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-surface-900 dark:text-white mb-1">{card.value}</h3>
            <p className="text-xs text-surface-500 dark:text-surface-400">{card.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
};

export default CompletionStatistics;
