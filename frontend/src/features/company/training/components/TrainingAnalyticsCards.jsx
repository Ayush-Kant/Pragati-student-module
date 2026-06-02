import { GraduationCap, Users, TrendingUp, Target } from 'lucide-react';

export const TrainingAnalyticsCards = () => {
  const cards = [
    {
      icon: GraduationCap,
      value: '81%',
      label: 'Completion Rate',
      trend: '+5%',
      iconBgColor: '#3BC4D8',
      iconColor: '#3BC4D8',
    },
    {
      icon: Users,
      value: '90%',
      label: 'Attendance Rate',
      trend: '+3%',
      iconBgColor: '#7467F0',
      iconColor: '#7467F0',
    },
    {
      icon: TrendingUp,
      value: '8.4/10',
      label: 'Engagement Score',
      trend: '+0.6',
      iconBgColor: '#F59E0B',
      iconColor: '#F59E0B',
    },
    {
      icon: Target,
      value: '76%',
      label: 'Job Readiness',
      trend: '+8%',
      iconBgColor: '#EC4899',
      iconColor: '#EC4899',
    },
  ];

  return (
    <div className="w-full grid grid-cols-4 gap-6 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="h-[180px] bg-white rounded-[16px] border border-[#E5E7EB] shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-all"
            style={{}}
          >
            <div className="flex items-start justify-between">
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: card.iconBgColor }}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#ECFDF3', color: '#16A34A' }}>
                <TrendingUp size={12} />
                {card.trend}
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold" style={{ color: '#0F172A' }}>
                {card.value}
              </div>
              <div className="text-sm mt-1" style={{ color: '#64748B' }}>
                {card.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

