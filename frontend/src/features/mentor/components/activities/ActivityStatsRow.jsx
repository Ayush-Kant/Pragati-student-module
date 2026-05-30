import React from 'react';
import { BarChart3, CheckCircle2, Clock, Edit3, Star } from 'lucide-react';
import StatsCard from '../../../../components/cards/StatsCard'; // Adjust path as needed

const ActivityStatsRow = ({ stats }) => {
  if (!stats) return null;

  const statItems = [
    { title: 'Total Activities', value: stats.total, change: '↑ 10% this week', icon: <BarChart3 className="w-5 h-5" />, iconColorClass: 'bg-purple-100 text-purple-600' },
    { title: 'Completed', value: stats.completed, change: '↑ 12% this week', icon: <CheckCircle2 className="w-5 h-5" />, iconColorClass: 'bg-green-100 text-green-600' },
    { title: 'Pending', value: stats.pending, change: '↓ 5% this week', icon: <Clock className="w-5 h-5" />, iconColorClass: 'bg-orange-100 text-orange-600' },
    { title: 'Drafts', value: stats.drafts, change: '↑ 8% this week', icon: <Edit3 className="w-5 h-5" />, iconColorClass: 'bg-pink-100 text-pink-600' },
    { title: 'Avg. Engagement', value: stats.avgEngagement, change: '↑ 10% this week', icon: <Star className="w-5 h-5" />, iconColorClass: 'bg-blue-100 text-blue-600' },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
      {statItems.map((item, index) => (
        <StatsCard 
          key={index} 
          title={item.title} 
          value={item.value} 
          change={item.change} 
          icon={item.icon}
          iconColorClass={item.iconColorClass}
        />
      ))}
    </div>
  );
};

export default ActivityStatsRow;
