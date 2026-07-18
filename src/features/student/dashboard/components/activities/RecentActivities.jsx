import React from 'react';
import { History } from 'lucide-react';
import ActivityCard from './ActivityCard';
import EmptyState from '../common/EmptyState';

export const RecentActivities = ({ activities = [] }) => {
  if (activities.length === 0) {
    return (
      <EmptyState
        iconName="History"
        title="No recent activity"
        message="Your completed logs will appear here once you attend classes or submit assignments."
      />
    );
  }

  // Sort by date descending (just in case)
  const sortedActivities = [...activities].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-3.5">
      <div className="flex items-center gap-2 mb-1">
        <History className="w-4 h-4 text-neon-violet" />
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Completed Achievements ({sortedActivities.length})
        </h3>
      </div>

      <div className="space-y-3">
        {sortedActivities.map((activity) => (
          <ActivityCard 
            key={activity.id} 
            activity={activity} 
          />
        ))}
      </div>
    </div>
  );
};

export default RecentActivities;
