import React from 'react';
import StatsCard from '../../../../../../components/cards/StatsCard'; // Adjust path as needed

const ActivityStatsRow = ({ stats }) => {
  if (!stats) return null;

  const statItems = [
    { title: 'Total Activities', value: stats.total, change: '+12% this week' },
    { title: 'Completed', value: stats.completed, change: '+12% this week' },
    { title: 'Pending', value: stats.pending, change: '+5% this week' },
    { title: 'Drafts', value: stats.drafts, change: '-8% this week' },
    { title: 'Avg. Engagement', value: stats.avgEngagement, change: '+10% this week' },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
      {statItems.map((item, index) => (
        <StatsCard key={index} title={item.title} value={item.value} change={item.change} />
      ))}
    </div>
  );
};

export default ActivityStatsRow;
