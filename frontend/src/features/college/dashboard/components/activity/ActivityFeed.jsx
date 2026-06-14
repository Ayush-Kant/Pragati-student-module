import React from 'react';
import ActivityCard from './ActivityCard';
import { activities } from '../../types/dashboardDummyData';
import { validateActivity } from '../../validations/dashboardValidation';
import { getStatusClass } from '../../utils/dashboardHelpers';


export default function ActivityFeed() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        Activity Feed
      </h2>

      {activities.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
        />
      ))}
    </div>
  );
}