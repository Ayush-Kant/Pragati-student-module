import { Briefcase, Users, CalendarCheck, BadgeCheck, TrendingUp } from 'lucide-react';

export const AnalyticsCards = () => {
  const cards = [
    {
      label: 'Active Drives',
      value: '12',
      icon: Briefcase,
      description: '3 this month',
      color: 'blue',
    },
    {
      label: 'Total Candidates',
      value: '711',
      icon: Users,
      description: '+45 this week',
      color: 'emerald',
    },
    {
      label: 'Interviews Scheduled',
      value: '148',
      icon: CalendarCheck,
      description: 'Next 30 days',
      color: 'purple',
    },
    {
      label: 'Offers Released',
      value: '32',
      icon: BadgeCheck,
      description: '12 pending',
      color: 'amber',
    },
    {
      label: 'Hiring Success Rate',
      value: '78%',
      icon: TrendingUp,
      description: '+5% from last month',
      color: 'rose',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col"
          >
            {/* Top Section: Label + Icon */}
            <div className="flex items-start justify-between mb-4">
              <span className="text-sm text-gray-500 font-medium">{card.label}</span>
              <div className={`w-12 h-12 rounded-xl ${colorClasses[card.color]} flex items-center justify-center`}>
                <Icon size={24} />
              </div>
            </div>

            {/* Bottom Section: Value + Description */}
            <div>
              <div className="text-3xl font-bold text-gray-900">{card.value}</div>
              <div className="text-sm text-gray-400 mt-1">{card.description}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
