import React from 'react';
import { recentUpdates } from '../../types/dashboardDummyData';

export default function RecentUpdates() {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h2 className="text-xl font-bold mb-4">
        Recent Updates
      </h2>

      {recentUpdates.map((update) => (
        <div
          key={update.id}
          className="mb-3 pb-2 border-b"
        >
          <h3 className="font-medium">
            {update.title}
          </h3>

          <p className="text-sm text-gray-500">
            {update.date}
          </p>
        </div>
      ))}
    </div>
  );
}