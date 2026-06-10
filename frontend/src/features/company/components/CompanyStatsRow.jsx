import { Briefcase, Users, Calendar, FileText, TrendingUp } from 'lucide-react';

const CompanyStatsRow = ({ stats }) => {
  const cards = [
    {
      icon: Briefcase,
      value: stats?.activeDrives || 0,
      label: 'Active Drives',
      trend: '+3',
      iconBgColor: '#3BC4D8',
    },
    {
      icon: Users,
      value: stats?.applications || 0,
      label: 'Candidates',
      trend: '+156',
      iconBgColor: '#7467F0',
    },
    {
      icon: Calendar,
      value: stats?.interviews || 0,
      label: 'Interviews',
      trend: '+12',
      iconBgColor: '#F59E0B',
    },
    {
      icon: FileText,
      value: stats?.offers || 0,
      label: 'Offers',
      trend: '+8',
      iconBgColor: '#8B5CF6',
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="h-[190px] bg-white rounded-[16px] border border-[#E5E7EB] shadow-sm p-6 hover:shadow-md transition-all flex flex-col justify-between"
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
              <div className="text-5xl font-bold text-gray-900">{card.value}</div>
              <div className="text-base font-medium text-gray-600 mt-2">{card.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CompanyStatsRow;
