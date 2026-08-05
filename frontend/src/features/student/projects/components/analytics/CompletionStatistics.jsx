import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CheckCircle2, Clock, Calendar, Zap } from 'lucide-react';

export const CompletionStatistics = ({ analytics }) => {
  const {
    completionPercentage = 0,
    tasksCompleted = 0,
    totalTasks = 0,
    milestonesCompleted = 0,
    totalMilestones = 0,
    daysRemaining = 0,
    taskDistribution = [],
  } = analytics || {};

  const statCards = [
    {
      title: 'Overall Progress',
      value: `${completionPercentage}%`,
      subtitle: `${milestonesCompleted}/${totalMilestones} Milestones Met`,
      icon: CheckCircle2,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Tasks Finished',
      value: `${tasksCompleted} / ${totalTasks}`,
      subtitle: `${totalTasks - tasksCompleted} tasks remaining`,
      icon: Zap,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Submission Target',
      value: `${daysRemaining} Days`,
      subtitle: 'Until target final defense',
      icon: Clock,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-5 shadow-lg flex items-center justify-between gap-4"
          >
            <div>
              <p className="text-xs font-medium text-slate-400">{card.title}</p>
              <h3 className="text-2xl font-extrabold text-white mt-1">{card.value}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{card.subtitle}</p>
            </div>
            <div className={`p-3 rounded-2xl border ${card.color} shrink-0`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CompletionStatistics;
