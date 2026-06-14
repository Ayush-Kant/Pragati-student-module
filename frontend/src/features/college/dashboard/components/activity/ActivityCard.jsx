import React from 'react';

export default function ActivityCard({ activity }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm mb-3">
      <h3 className="font-semibold">{activity.title}</h3>

      <p className="text-sm text-gray-600">
        {activity.description}
      </p>

      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>{activity.time}</span>
        <span>{activity.status}</span>
      </div>
    </div>
  );
}