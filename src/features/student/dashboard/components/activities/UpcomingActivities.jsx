import React from 'react';
import { Calendar } from 'lucide-react';
import ActivityCard from './ActivityCard';
import DeadlineCard from './DeadlineCard';
import EmptyState from '../common/EmptyState';

export const UpcomingActivities = ({ activities = [], onActionTrigger }) => {
  if (activities.length === 0) {
    return (
      <EmptyState
        iconName="CalendarOff"
        title="No upcoming activities"
        message="You have no classes, submissions, or exams scheduled for the next few days."
      />
    );
  }

  const handleAction = (activity) => {
    if (onActionTrigger) {
      onActionTrigger(activity.type === 'ASSIGNMENT' ? 'submit_assignment' : 'join_class', activity);
    }
  };

  return (
    <div className="space-y-3.5">
      <div className="flex items-center gap-2 mb-1">
        <Calendar className="w-4 h-4 text-neon-cyan" />
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Scheduled Activities ({activities.length})
        </h3>
      </div>
      
      {activities.map((activity) => {
        const isAssignment = activity.type === 'ASSIGNMENT';
        if (isAssignment) {
          return (
            <DeadlineCard 
              key={activity.id} 
              activity={activity} 
              onAction={() => handleAction(activity)} 
            />
          );
        }
        return (
          <ActivityCard
            key={activity.id}
            activity={activity}
            actionLabel={activity.type === 'CLASS' ? 'Join Live' : 'Register'}
            onAction={() => handleAction(activity)}
          />
        );
      })}
    </div>
  );
};

export default UpcomingActivities;
