import React from 'react';
import ActivityCard from './ActivityCard';
import { activities } from '../../types/dashboardDummyData';
import { validateActivity } from '../../validations/dashboardValidation';
import { ACTIVITY_FEED_TITLE } from '../../constants/dashboardConstants';

export default function ActivityFeed() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {ACTIVITY_FEED_TITLE}
      </h2>

      {activities
        .filter(validateActivity)
        .map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
          />
        ))}
    </div>
  );
}